var EXPORTED_SYMBOLS = ["Linkification"];

//(function() {

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const Cr = Components.results;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

const sAlphanumeric = '[^`~!@#$%^&*()_=+\\[{\\]}\\\\|;:\'",<.>\\/?\\s]';

const sURLPathChars = '[^\\^\\[\\]{}|\\\\\'"<>`\\s]';
const sEndChars = '[^!@\\^()\\[\\]{}|\\\\:;\'",.?<>`\\s]';
const sUserNamePasswordChars = '[^@:<>(){}`\'"\\/\\[\\]\\s]';
const sGetStringChars = '[^\\^*\\[\\]{}|\\\\"<>\\/`\\s]';

const sTopLevelDomains = '[a-z]{2,6}';
const sIPv4Address = '(?:(?:(?:[0-1]?[0-9]?[0-9])|(?:2[0-4][0-9])|(?:25[0-5]))(?:\\.(?:(?:[0-1]?[0-9]?[0-9])|(?:2[0-4][0-9])|(?:25[0-5]))){3})';
const sIPv6Address = '(?:[A-Fa-f0-9:]{16,39})';
const sIPAddress = '(?:' + sIPv4Address + '|' + sIPv6Address + ')';

const sAllSubDomain = sAlphanumeric + '+';
const sURLPath = sURLPathChars + '*' + sEndChars;

const sOtherAuth = '(?:' + sUserNamePasswordChars + '+:' + sUserNamePasswordChars + '+@(' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + '))(?:\/(?:(?:' + sURLPath + ')?)?)?(?:[#?](?:' + sURLPath + ')?)?)';
const sOtherOptionalAuth = '(?:(?:' + sUserNamePasswordChars + '+@)?(' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + '))\/(?:' + sURLPath + '(?:[#?](?:' + sURLPath + ')?)?)?)';
const sOtherOptionalAuthSelected = '(?:(?:[^*=/<>(){}\\[\\]\\s]+@)?((' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + ')))(?:/(?:' + sURLPath + ')?)?(?:[#?](?:' + sURLPath + ')?)?)';

var Linkification = {
	init: function() {
		XPCOMUtils.defineLazyGetter(this, "aExcludeElements", function() this.sExcludeElements.split(','));
		XPCOMUtils.defineLazyGetter(this, "aInlineElements", function() this.sInlineElements.split(','));
		XPCOMUtils.defineLazyGetter(this, "aInlineHash", function() {
			var aInlineHash = [], ctr;
			for (ctr = 0; ctr < this.aInlineElements.length; ++ctr)
				aInlineHash[this.aInlineElements[ctr]] = true;
			return aInlineHash;
		});

		XPCOMUtils.defineLazyGetter(this, "oProtocol", function() {
			var o = {
				aProtocol: [],
				oMapping: {}
			}, ctr;

			var aTextLinkProtocol;
			var aTextProtocolList = this.sProtocols.split(',');
			for (ctr = 0; ctr < aTextProtocolList.length; ++ctr)
			{
				aTextLinkProtocol = aTextProtocolList[ctr].split(':');
				if ((aTextLinkProtocol[0].length > 0) && (aTextLinkProtocol[1].length > 0))
				{
					if (aTextLinkProtocol[1].substr(aTextLinkProtocol[1].length - 1) == '!')
					{
						aTextLinkProtocol[0] += ':';
						aTextLinkProtocol[1] = aTextLinkProtocol[1].substr(0, aTextLinkProtocol[1].length - 1) + ':';
					}
					else
					{
						aTextLinkProtocol[0] += ':\\/\\/';
						aTextLinkProtocol[1] += '://';
					}
					o.aProtocol.push(aTextLinkProtocol[0]);
					o.oMapping[aTextLinkProtocol[0]] = aTextLinkProtocol[1];
				}
			}

			return o;
		});

		XPCOMUtils.defineLazyGetter(this, "oSubDomain", function() {
			var o = {
				aSubDomain: [],
				oMapping: {}
			}, ctr;

			var aSubdomainProtocolList = this.sSubDomains.split(',');
			for (ctr = 0; ctr < aSubdomainProtocolList.length; ++ctr)
			{
				aTextLinkProtocol = aSubdomainProtocolList[ctr].split(':');
				if ((aTextLinkProtocol[0].length > 0) && (aTextLinkProtocol[1].length > 0))
				{
					if (aTextLinkProtocol[1].substr(aTextLinkProtocol[1].length - 1) == '!')
					{
						aTextLinkProtocol[1] = aTextLinkProtocol[1].substr(0, aTextLinkProtocol[1].length - 1) + ':';
					}
					else
					{
						aTextLinkProtocol[1] += '://';
					}

					o.aSubDomain.push(aTextLinkProtocol[0]);
					o.oMapping[aTextLinkProtocol[0]] = aTextLinkProtocol[1];
				}
			}

			return o;
		});

		XPCOMUtils.defineLazyGetter(this, "rx", function() {
			var o = {};
			var sProtocol = '(' + this.oProtocol.aProtocol.join('|') + ')';
			var sSubDomain = '(' + this.oSubDomain.aSubDomain.join('|') + ')';

			var sWWWAuth = '(?:(?:(?:' + sUserNamePasswordChars + '+:)?' + sUserNamePasswordChars + '+@)?' + sSubDomain + '\\.(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + '(?:[/#?](?:' + sURLPath + ')?)?)';

			var sRegExpHTTP = '(?:' + sProtocol + sURLPath + ')';
			var sRegExpWWW = '(?:' + sWWWAuth + '|' + sOtherOptionalAuth + '|' + sOtherAuth + ')';
			var sRegExpEmail = '(' + sUserNamePasswordChars + '+@' + '(?:(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + ')|(?:' + sIPAddress + '))(?:' + sGetStringChars + '+' + sEndChars + ')?)';
			o.sRegExpAll = new RegExp(sRegExpHTTP + '|' + sRegExpWWW + '|' + sRegExpEmail, 'i');

			sRegExpWWW = '(?:' + sWWWAuth + '|' + sOtherOptionalAuthSelected + ')';
			o.sRegExpSelected = new RegExp('^(?:' + sRegExpHTTP + '|' + sRegExpEmail + '|' + sRegExpWWW + ')$', 'i');

			return o;
		});

		XPCOMUtils.defineLazyGetter(this, "sXPath", function() {
			var sXPath = '//text()[not(ancestor::' + this.aExcludeElements.join(' or ancestor::') + ') and (',
				aSubDomain = this.oSubDomain.aSubDomain,
				s, up, lo, ctr;
			for (ctr = 0; ctr < aSubDomain.length; ++ctr)
			{
				s = aSubDomain[ctr];
				up = s.toUpperCase();
				lo = s.toLowerCase();
				sXPath += "contains(translate(., '" + up + "', '" + lo + "'), '" + lo + "') or ";
			}
			return sXPath + "contains(., '@') or contains(., '/') or contains(., ':'))]";
		});
	},

	get bThorough() this.prefs.getBoolPref('Linkify_Thorough'),
	get bAutoLinkify() this.prefs.getBoolPref('Linkify_Toggle'),
	get bDoubleClick() this.prefs.getBoolPref('Linkify_DoubleClick'),
	get bOpenSelected() this.prefs.getBoolPref('Linkify_OpenSelected_Toggle'),
	get bContextMenu() this.prefs.getBoolPref('Linkify_Popup_Toggle'),
	get bStatusBar() this.prefs.getBoolPref('Linkify_StatusBar_Toggle'),
	get bTextColor() this.prefs.getBoolPref('Linkify_HighlightText'),
	get bBackgroundColor() this.prefs.getBoolPref('Linkify_HighlightBG'),
	get sTextColor() this.prefs.getCharPref('Linkify_TextColor'),
	get sBackgroundColor() this.prefs.getCharPref('Linkify_BackgroundColor'),
	get bLinksOpenWindows() this.prefs.getBoolPref('Linkify_OpenInWindow'),
	get bLinksOpenTabs() this.prefs.getBoolPref('Linkify_OpenInTab'),
	get bTabsOpenInBG() this.prefs.getBoolPref('Linkify_OpenTabInBG'),
	get bLinkifyImageURLs() this.prefs.getBoolPref('Linkify_LinkifyImages'),
	get bLinkifyProtocol() this.prefs.getBoolPref('Linkify_LinkifyProtocol'),
	get bLinkifyKnown() this.prefs.getBoolPref('Linkify_LinkifyKnown'),
	get bLinkifyUnknown() this.prefs.getBoolPref('Linkify_LinkifyUnknown'),
	get bLinkifyEmail() this.prefs.getBoolPref('Linkify_LinkifyEmail'),
	get sProtocols() this.prefs.getCharPref('Linkify_TextProtocolList'),
	get sSubDomains() this.prefs.getCharPref('Linkify_SubdomainProtocolList'),
	get sInlineElements() this.prefs.getCharPref('Linkify_InlineElements'),
	get sExcludeElements() this.prefs.getCharPref('Linkify_ExcludeElements'),
	get bUseBlacklist() this.prefs.getBoolPref('Linkify_Blacklist'),
	get bUseWhitelist() this.prefs.getBoolPref('Linkify_Whitelist'),
	get sSitelist() this.prefs.getCharPref('Linkify_SiteList'),
	get bEnableCharLimit() this.prefs.getBoolPref('Linkify_CharLimitEnabled'),
	get nCharLimit() this.prefs.getIntPref('Linkify_CharLimit')
};

XPCOMUtils.defineLazyGetter(Linkification, "stringBundle", function() Services.strings.createBundle("chrome://linkification/locale/linkification.properties"));
XPCOMUtils.defineLazyGetter(Linkification, "prefs", function() Services.prefs.getBranch('extensions.linkification.'));
XPCOMUtils.defineLazyGetter(Linkification, "defaultPrefs", function() Services.prefs.getDefaultBranch('extensions.linkification.'));
XPCOMUtils.defineLazyGetter(Linkification, "sDefaultTextColor", function() this.defaultPrefs.getCharPref('Linkify_TextColor'));
XPCOMUtils.defineLazyGetter(Linkification, "sDefaultBackgroundColor", function() this.defaultPrefs.getCharPref('Linkify_BackgroundColor'));
XPCOMUtils.defineLazyGetter(Linkification, "sDefaultProtocol", function() this.defaultPrefs.getCharPref('Linkify_TextProtocolList'));
XPCOMUtils.defineLazyGetter(Linkification, "sDefaultSubdomain", function() this.defaultPrefs.getCharPref('Linkify_SubdomainProtocolList'));
XPCOMUtils.defineLazyGetter(Linkification, "sDefaultSiteList", function() this.defaultPrefs.getCharPref('Linkify_SiteList'));
XPCOMUtils.defineLazyGetter(Linkification, "sDefaultInlineElements", function() this.defaultPrefs.getCharPref('Linkify_InlineElements'));
XPCOMUtils.defineLazyGetter(Linkification, "sDefaultExcludeElements", function() this.defaultPrefs.getCharPref('Linkify_ExcludeElements'));


Linkification.init();

//})();

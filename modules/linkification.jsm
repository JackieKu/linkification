var EXPORTED_SYMBOLS = ["Linkification"];

//(function() {

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const Cr = Components.results;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

var sAlphanumeric = '[^`~!@#$%^&*()_=+\\[{\\]}\\\\|;:\'",<.>\\/?\\s]';

var sURLPathChars = '[^\\^\\[\\]{}|\\\\\'"<>`\\s]';
var sEndChars = '[^!@\\^()\\[\\]{}|\\\\:;\'",.?<>`\\s]';
var sUserNamePasswordChars = '[^@:<>(){}`\'"\\/\\[\\]\\s]';
var sGetStringChars = '[^\\^*\\[\\]{}|\\\\"<>\\/`\\s]';

var sTopLevelDomains = '[a-z]{2,6}';
var sIPv4Address = '(?:(?:(?:[0-1]?[0-9]?[0-9])|(?:2[0-4][0-9])|(?:25[0-5]))(?:\\.(?:(?:[0-1]?[0-9]?[0-9])|(?:2[0-4][0-9])|(?:25[0-5]))){3})';
var sIPv6Address = '(?:[A-Fa-f0-9:]{16,39})';
var sIPAddress = '(?:' + sIPv4Address + '|' + sIPv6Address + ')';

var Linkification = {
	sDefaultTextColor : '#006620',
	sDefaultBackgroundColor : '#fff9ab',
	sDefaultProtocol : 'news:news,nntp:nntp,telnet:telnet,irc:irc,mms:mms,ed2k:ed2k,file:file,about:about!,mailto:mailto!,xmpp:xmpp!,h...s:https,f.p:ftp,h.?.?p:http',
	sDefaultSubdomain : 'www:http,ftp:ftp,irc:irc,jabber:xmpp!',
	sDefaultSiteList : 'localhost,google.com',
	sDefaultInlineElements : 'a,abbr,acronym,b,basefont,bdo,big,cite,code,dfn,em,font,i,kbd,label,nobr,q,s,samp,small,span,strike,strong,sub,sup,tt,u,wbr,var',
	sDefaultExcludeElements : "a,applet,area,embed,frame,frameset,head,iframe,img,map,meta,noscript,object,option,param,script,select,style,textarea,title,*[@onclick],*[@onmousedown],*[@onmouseup],*[@tiddler],*[@class='linkification-disabled']",

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

			var sAllSubDomain = sAlphanumeric + '+';
			var sURLPath = sURLPathChars + '*' + sEndChars;

			var sWWWAuth = '(?:(?:(?:' + sUserNamePasswordChars + '+:)?' + sUserNamePasswordChars + '+@)?' + sSubDomain + '\\.(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + '(?:[/#?](?:' + sURLPath + ')?)?)';
			var sOtherOptionalAuth = '(?:(?:' + sUserNamePasswordChars + '+@)?(' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + '))\/(?:' + sURLPath + '(?:[#?](?:' + sURLPath + ')?)?)?)';
			var sOtherAuth = '(?:' + sUserNamePasswordChars + '+:' + sUserNamePasswordChars + '+@(' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + '))(?:\/(?:(?:' + sURLPath + ')?)?)?(?:[#?](?:' + sURLPath + ')?)?)';

			var sRegExpHTTP = '(?:' + sProtocol + sURLPath + ')';
			var sRegExpWWW = '(?:' + sWWWAuth + '|' + sOtherOptionalAuth + '|' + sOtherAuth + ')';
			var sRegExpEmail = '(' + sUserNamePasswordChars + '+@' + '(?:(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + ')|(?:' + sIPAddress + '))(?:' + sGetStringChars + '+' + sEndChars + ')?)';
			o.sRegExpAll = new RegExp(sRegExpHTTP + '|' + sRegExpWWW + '|' + sRegExpEmail, 'i');

			sOtherOptionalAuth = '(?:(?:[^*=/<>(){}\\[\\]\\s]+@)?((' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + ')))(?:/(?:' + sURLPath + ')?)?(?:[#?](?:' + sURLPath + ')?)?)';
			sRegExpWWW = '(?:' + sWWWAuth + '|' + sOtherOptionalAuth + ')';
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

XPCOMUtils.defineLazyGetter(Linkification, "prefs", function() Services.prefs.getBranch('extensions.linkification.'));
XPCOMUtils.defineLazyGetter(Linkification, "stringBundle", function() Services.strings.createBundle("chrome://linkification/locale/linkification.properties"));

Linkification.init();

//})();

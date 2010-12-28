var EXPORTED_SYMBOLS = ["Linkification"];

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
const sURLPath = '(?:' + sURLPathChars + '*' + sEndChars + '|\\|.+?\\|/)';

const sOtherAuth = '(?:' + sUserNamePasswordChars + '+:' + sUserNamePasswordChars + '+@(' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + '))(?:\/(?:(?:' + sURLPath + ')?)?)?(?:[#?](?:' + sURLPath + ')?)?)';
const sOtherOptionalAuth = '(?:(?:' + sUserNamePasswordChars + '+@)?(' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + '))\/(?:' + sURLPath + '(?:[#?](?:' + sURLPath + ')?)?)?)';
const sOtherOptionalAuthSelected = '(?:(?:[^*=/<>(){}\\[\\]\\s]+@)?((' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + ')))(?:/(?:' + sURLPath + ')?)?(?:[#?](?:' + sURLPath + ')?)?)';

var
p = {
	prefTypes: {
		b: {g: "getBoolPref", s: "setBoolPref"},
		s: {g: "getCharPref", s: "setCharPref"},
		n: {g: "getIntPref", s: "setIntPref"}
	},
	prefsMapping: {},
	prefValues: {} // cached preferences
},
Linkification = {
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

		XPCOMUtils.defineLazyGetter(this, "_rx", function() {
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

	definePref: function(name) {
		var type = p.prefTypes[name.charAt(0)];

		p.prefsMapping[name] = name;

		XPCOMUtils.defineLazyGetter(p.prefValues, name, function() Linkification.prefs[type.g](name));

		// append "Default" to name to retrieve default value. 
		XPCOMUtils.defineLazyGetter(this, name + "Default", function() this.defaultPrefs[type.g](name));

		this.__defineGetter__(name, function() p.prefValues[name]);
		this.__defineSetter__(name, function(value) {
			this.prefs[type.s](name, value);
			// cached value is update by the observer
			//delete p.prefValues[name];
			//p.prefValues[name] = value;
		});
	},

	get sRegExpAll() this._rx.sRegExpAll,
	get sRegExpSelected() this._rx.sRegExpSelected
};

XPCOMUtils.defineLazyGetter(Linkification, "stringBundle", function() Services.strings.createBundle("chrome://linkification/locale/linkification.properties"));
XPCOMUtils.defineLazyGetter(Linkification, "prefs", function() Services.prefs.getBranch('extensions.linkification.').QueryInterface(Ci.nsIPrefBranch2));
XPCOMUtils.defineLazyGetter(Linkification, "defaultPrefs", function() Services.prefs.getDefaultBranch('extensions.linkification.'));

// preferences
[
	"bThorough",
	"bAutoLinkify",
	"bDoubleClick",
	"bOpenSelected",
	"bContextMenu",
	"bStatusBar",
	"bTextColor",
	"bBackgroundColor",
	"sTextColor",
	"sBackgroundColor",
	"bLinksOpenWindows",
	"bLinksOpenTabs",
	"bTabsOpenInBG",
	"bLinkifyImageURLs",
	"bLinkifyProtocol",
	"bLinkifyKnown",
	"bLinkifyUnknown",
	"bLinkifyEmail",
	"sProtocols",
	"sSubDomains",
	"sInlineElements",
	"sExcludeElements",
	"bUseBlacklist",
	"bUseWhitelist",
	"sSitelist",
	"bEnableCharLimit",
	"nCharLimit"
].forEach(function(v) { Linkification.definePref(v); });

Linkification.init();
Linkification.prefs.addObserver("", {
	observe: function(aSubject, aTopic, aData) {
		if (!p.prefsMapping.hasOwnProperty(aData))
			return;
		var type = p.prefTypes[aData.charAt(0)];
		delete p.prefValues[aData];
		p.prefValues[aData] = Linkification.prefs[type.g](aData);
	}
}, false);

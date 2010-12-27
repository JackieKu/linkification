(function() {

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const Co = Components.Constructor;

Cu.import("resource://linkification/linkification.jsm");

window.objLinkOptions = {
	LinkOptions_Init: function()
	{
		this.ndTextBox = document.getElementById('linkify_textbox');
		this.ndTextColor = document.getElementById('linkify_textcolorpicker');
		this.ndBackgroundBox = document.getElementById('linkify_backgroundbox');
		this.ndBackgroundColor = document.getElementById('linkify_backgroundcolorpicker');
		this.ndLinkifyToggle = document.getElementById('linkify_toggle');
		this.ndLinkifyThorough = document.getElementById('linkify_thorough');
		this.ndLinkifyDoubleClick = document.getElementById('linkify_doubleclick');
		this.ndOpenSelectedToggle = document.getElementById('linkify_openselectedtoggle');
		this.ndPopupToggle = document.getElementById('linkify_popuptoggle');
		this.ndStatusBarToggle = document.getElementById('linkify_statusbartoggle');
		this.ndOpenInWindow = document.getElementById('linkify_openinwindowbox');
		this.ndOpenInTab = document.getElementById('linkify_openintabbox');
		this.ndOpenInBG = document.getElementById('linkify_opentabinbgbox');
		this.ndImageToggle = document.getElementById('linkify_image');
		this.ndProtocolToggle = document.getElementById('linkify_protocol');
		this.ndKnownToggle = document.getElementById('linkify_known');
		this.ndUnknownToggle = document.getElementById('linkify_unknown');
		this.ndEmailToggle = document.getElementById('linkify_email');
		this.ndLinkifyTextProtocolList = document.getElementById('linkify_textprotocollist');
		this.ndLinkifyDefaultProtocol = document.getElementById('linkify_defaultprotocol');
		this.ndLinkifySubdomainProtocolList = document.getElementById('linkify_subdomainprotocollist');
		this.ndLinkifyDefaultSubdomain = document.getElementById('linkify_defaultsubdomain');
		this.ndLinkifyInlineElementList = document.getElementById('linkify_inlineelementlist');
		this.ndLinkifyDefaultInline = document.getElementById('linkify_inlineelement');
		this.ndLinkifyExcludeElementList = document.getElementById('linkify_excludeelementlist');
		this.ndLinkifyDefaultExclude = document.getElementById('linkify_excludeelement');
		this.ndLinkifyBlacklist = document.getElementById('linkify_blacklist');
		this.ndLinkifyWhitelist = document.getElementById('linkify_whitelist');
		this.ndLinkifySiteList = document.getElementById('linkify_sitelist');
		this.ndLinkifyDefaultSiteList = document.getElementById('linkify_defaultsitelist');
		this.ndLinkifyCharLimitEnabled = document.getElementById('linkify_charlimitenabled');
		this.ndLinkifyCharLimit = document.getElementById('linkify_charlimit');

		this.ndLinkifyToggle.checked = Linkification.bAutoLinkify;
		this.ndLinkifyThorough.checked = Linkification.bThorough;
		this.ndLinkifyDoubleClick.checked = Linkification.bDoubleClick;
		this.ndOpenSelectedToggle.checked = Linkification.bOpenSelected;
		this.ndPopupToggle.checked = Linkification.bContextMenu;
		this.ndStatusBarToggle.checked = Linkification.bStatusBar;
		this.ndTextBox.checked = Linkification.bTextColor;
		this.ndBackgroundBox.checked = Linkification.bBackgroundColor;
		this.ndTextColor.color = Linkification.sTextColor;
		this.ndBackgroundColor.color = Linkification.sBackgroundColor;
		this.ndOpenInWindow.checked = Linkification.bLinksOpenWindows;
		this.ndOpenInTab.checked = Linkification.bLinksOpenTabs;
		this.ndOpenInBG.checked = Linkification.bTabsOpenInBG;
		this.ndImageToggle.checked = Linkification.bLinkifyImageURLs;
		this.ndProtocolToggle.checked = Linkification.bLinkifyProtocol;
		this.ndKnownToggle.checked = Linkification.bLinkifyKnown;
		this.ndUnknownToggle.checked = Linkification.bLinkifyUnknown;
		this.ndEmailToggle.checked = Linkification.bLinkifyEmail;
		this.ndLinkifyTextProtocolList.value = Linkification.sProtocols;
		this.ndLinkifySubdomainProtocolList.value = Linkification.sSubDomains;
		this.ndLinkifyInlineElementList.value = Linkification.sInlineElements;
		this.ndLinkifyExcludeElementList.value = Linkification.sExcludeElements;
		this.ndLinkifyBlacklist.checked = Linkification.bUseBlacklist;
		this.ndLinkifyWhitelist.checked = Linkification.bUseWhitelist;
		this.ndLinkifySiteList.value = Linkification.sSitelist;
		this.ndLinkifyCharLimitEnabled.checked = Linkification.bEnableCharLimit;
		this.ndLinkifyCharLimit.value = Linkification.nCharLimit;

		this.LinkOptions_Toggle();
		this.LinkOptions_ToggleWindow();
		this.LinkOptions_ToggleTab();

		return true;
	},

	LinkOptions_Update: function()
	{
		Linkification.prefs.setBoolPref('Linkify_HighlightText', this.ndTextBox.checked);
		Linkification.prefs.setCharPref('Linkify_TextColor', this.ndTextColor.color);
		Linkification.prefs.setBoolPref('Linkify_HighlightBG', this.ndBackgroundBox.checked);
		Linkification.prefs.setCharPref('Linkify_BackgroundColor', this.ndBackgroundColor.color);
		Linkification.prefs.setBoolPref('Linkify_Toggle', this.ndLinkifyToggle.checked);
		Linkification.prefs.setBoolPref('Linkify_Thorough', this.ndLinkifyThorough.checked);
		Linkification.prefs.setBoolPref('Linkify_DoubleClick', this.ndLinkifyDoubleClick.checked);
		Linkification.prefs.setBoolPref('Linkify_OpenSelected_Toggle', this.ndOpenSelectedToggle.checked);
		Linkification.prefs.setBoolPref('Linkify_Popup_Toggle', this.ndPopupToggle.checked);
		Linkification.prefs.setBoolPref('Linkify_StatusBar_Toggle', this.ndStatusBarToggle.checked);
		Linkification.prefs.setBoolPref('Linkify_OpenInWindow', this.ndOpenInWindow.checked);
		Linkification.prefs.setBoolPref('Linkify_OpenInTab', this.ndOpenInTab.checked);
		Linkification.prefs.setBoolPref('Linkify_OpenTabInBG', this.ndOpenInBG.checked);
		Linkification.prefs.setBoolPref('Linkify_LinkifyImages', this.ndImageToggle.checked);
		Linkification.prefs.setBoolPref('Linkify_LinkifyProtocol', this.ndProtocolToggle.checked);
		Linkification.prefs.setBoolPref('Linkify_LinkifyKnown', this.ndKnownToggle.checked);
		Linkification.prefs.setBoolPref('Linkify_LinkifyUnknown', this.ndUnknownToggle.checked);
		Linkification.prefs.setBoolPref('Linkify_LinkifyEmail', this.ndEmailToggle.checked);
		Linkification.prefs.setCharPref('Linkify_TextProtocolList', this.ndLinkifyTextProtocolList.value);
		Linkification.prefs.setCharPref('Linkify_SubdomainProtocolList', this.ndLinkifySubdomainProtocolList.value);
		Linkification.prefs.setCharPref('Linkify_InlineElements', this.ndLinkifyInlineElementList.value);
		Linkification.prefs.setCharPref('Linkify_ExcludeElements', this.ndLinkifyExcludeElementList.value);
		Linkification.prefs.setBoolPref('Linkify_Blacklist', this.ndLinkifyBlacklist.checked);
		Linkification.prefs.setBoolPref('Linkify_Whitelist', this.ndLinkifyWhitelist.checked);
		Linkification.prefs.setCharPref('Linkify_SiteList', this.ndLinkifySiteList.value);
		Linkification.prefs.setBoolPref('Linkify_CharLimitEnabled', this.ndLinkifyCharLimitEnabled.checked);
		Linkification.prefs.setIntPref('Linkify_CharLimit', this.ndLinkifyCharLimit.value);

		Linkification.init();

		return true;
	},

	LinkOptions_Toggle: function()
	{
		this.ndLinkifyCharLimit.disabled = !this.ndLinkifyCharLimitEnabled.checked;

		this.ndLinkifySiteList.disabled = !this.ndLinkifyBlacklist.checked && !this.ndLinkifyWhitelist.checked;
		this.ndLinkifyDefaultSiteList.disabled = this.ndLinkifySiteList.disabled;

		return true;
	},

	LinkOptions_ToggleWindow: function()
	{
		if (this.ndOpenInWindow.checked)
		{
			this.ndOpenInTab.checked = false;
			this.ndOpenInBG.disabled = true;
		}

		return true;
	},

	LinkOptions_ToggleTab: function()
	{
		if (this.ndOpenInTab.checked)
		{
			this.ndOpenInWindow.checked = false;
			this.ndOpenInBG.disabled = false;
		}
		else
		{
			this.ndOpenInBG.disabled = true;
		}

		return true;
	},

	LinkOptions_ToggleWhitelist: function()
	{
		if (this.ndLinkifyWhitelist.checked)
		{
			this.ndLinkifyBlacklist.checked = false;
		}

		this.ndLinkifySiteList.disabled = !this.ndLinkifyBlacklist.checked && !this.ndLinkifyWhitelist.checked;
		this.ndLinkifyDefaultSiteList.disabled = this.ndLinkifySiteList.disabled;

		return true;
	},

	LinkOptions_ToggleBlacklist: function()
	{
		if (this.ndLinkifyBlacklist.checked)
		{
			this.ndLinkifyWhitelist.checked = false;
		}

		this.ndLinkifySiteList.disabled = !this.ndLinkifyBlacklist.checked && !this.ndLinkifyWhitelist.checked;
		this.ndLinkifyDefaultSiteList.disabled = this.ndLinkifySiteList.disabled;

		return true;
	},

	LinkOptions_DefaultProtocol: function()
	{
		this.ndLinkifyTextProtocolList.value = Linkification.sDefaultProtocol;

		return true;
	},

	LinkOptions_DefaultSubdomain: function()
	{
		this.ndLinkifySubdomainProtocolList.value = Linkification.sDefaultSubdomain;

		return true;
	},

	LinkOptions_DefaultInline: function()
	{
		this.ndLinkifyInlineElementList.value = Linkification.sDefaultInlineElements;

		return true;
	},

	LinkOptions_DefaultExclude: function()
	{
		this.ndLinkifyExcludeElementList.value = Linkification.sDefaultExcludeElements;

		return true;
	},

	LinkOptions_DefaultSiteList: function()
	{
		this.ndLinkifySiteList.value = Linkification.sDefaultSiteList;

		return true;
	}
};

})();

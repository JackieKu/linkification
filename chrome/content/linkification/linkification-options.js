var objLinkOptions = {

	ndWindow : Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow('navigator:browser'),

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

		this.ndLinkifyToggle.checked = this.ndWindow.objLinkify.bAutoLinkify;
		this.ndLinkifyThorough.checked = this.ndWindow.objLinkify.bThorough;
		this.ndLinkifyDoubleClick.checked = this.ndWindow.objLinkify.bDoubleClick;
		this.ndOpenSelectedToggle.checked = this.ndWindow.objLinkify.bOpenSelected;
		this.ndPopupToggle.checked = this.ndWindow.objLinkify.bContextMenu;
		this.ndStatusBarToggle.checked = this.ndWindow.objLinkify.bStatusBar;
		this.ndTextBox.checked = this.ndWindow.objLinkify.bTextColor;
		this.ndBackgroundBox.checked = this.ndWindow.objLinkify.bBackgroundColor;
		this.ndTextColor.color = this.ndWindow.objLinkify.sTextColor;
		this.ndBackgroundColor.color = this.ndWindow.objLinkify.sBackgroundColor;
		this.ndOpenInWindow.checked = this.ndWindow.objLinkify.bLinksOpenWindows;
		this.ndOpenInTab.checked = this.ndWindow.objLinkify.bLinksOpenTabs;
		this.ndOpenInBG.checked = this.ndWindow.objLinkify.bTabsOpenInBG;
		this.ndImageToggle.checked = this.ndWindow.objLinkify.bLinkifyImageURLs;
		this.ndProtocolToggle.checked = this.ndWindow.objLinkify.bLinkifyProtocol;
		this.ndKnownToggle.checked = this.ndWindow.objLinkify.bLinkifyKnown;
		this.ndUnknownToggle.checked = this.ndWindow.objLinkify.bLinkifyUnknown;
		this.ndEmailToggle.checked = this.ndWindow.objLinkify.bLinkifyEmail;
		this.ndLinkifyTextProtocolList.value = this.ndWindow.objLinkify.sProtocols;
		this.ndLinkifySubdomainProtocolList.value = this.ndWindow.objLinkify.sSubDomains;
		this.ndLinkifyInlineElementList.value = this.ndWindow.objLinkify.sInlineElements;
		this.ndLinkifyExcludeElementList.value = this.ndWindow.objLinkify.sExcludeElements;
		this.ndLinkifyBlacklist.checked = this.ndWindow.objLinkify.bUseBlacklist;
		this.ndLinkifyWhitelist.checked = this.ndWindow.objLinkify.bUseWhitelist;
		this.ndLinkifySiteList.value = this.ndWindow.objLinkify.sSitelist;
		this.ndLinkifyCharLimitEnabled.checked = this.ndWindow.objLinkify.bEnableCharLimit;
		this.ndLinkifyCharLimit.value = this.ndWindow.objLinkify.nCharLimit;

		this.LinkOptions_Toggle();
		this.LinkOptions_ToggleWindow();
		this.LinkOptions_ToggleTab();

		return true;
	},

	LinkOptions_Update: function()
	{
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_HighlightText') || !(this.ndTextBox.checked == false)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_HighlightText', this.ndTextBox.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_TextColor') || !(this.ndTextColor.color == this.ndWindow.objLinkify.sDefaultTextColor)) this.ndWindow.objLinkify.objLinkifyPrefs.setCharPref('Linkify_TextColor', this.ndTextColor.color);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_HighlightBG') || !(this.ndBackgroundBox.checked == false)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_HighlightBG', this.ndBackgroundBox.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_BackgroundColor') || !(this.ndBackgroundColor.color == this.ndWindow.objLinkify.sDefaultBackgroundColor)) this.ndWindow.objLinkify.objLinkifyPrefs.setCharPref('Linkify_BackgroundColor', this.ndBackgroundColor.color);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_Toggle') || !(this.ndLinkifyToggle.checked == true)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_Toggle', this.ndLinkifyToggle.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_Thorough') || !(this.ndLinkifyThorough.checked == false)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_Thorough', this.ndLinkifyThorough.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_DoubleClick') || !(this.ndLinkifyDoubleClick.checked == true)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_DoubleClick', this.ndLinkifyDoubleClick.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_OpenSelected_Toggle') || !(this.ndOpenSelectedToggle.checked == true)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_OpenSelected_Toggle', this.ndOpenSelectedToggle.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_Popup_Toggle') || !(this.ndPopupToggle.checked == false)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_Popup_Toggle', this.ndPopupToggle.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_StatusBar_Toggle') || !(this.ndStatusBarToggle.checked == true)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_StatusBar_Toggle', this.ndStatusBarToggle.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_OpenInWindow') || !(this.ndOpenInWindow.checked == false)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_OpenInWindow', this.ndOpenInWindow.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_OpenInTab') || !(this.ndOpenInTab.checked == false)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_OpenInTab', this.ndOpenInTab.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_OpenTabInBG') || !(this.ndOpenInBG.checked == false)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_OpenTabInBG', this.ndOpenInBG.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyImages') || !(this.ndImageToggle.checked == true)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_LinkifyImages', this.ndImageToggle.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyProtocol') || !(this.ndProtocolToggle.checked == true)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_LinkifyProtocol', this.ndProtocolToggle.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyKnown') || !(this.ndKnownToggle.checked == true)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_LinkifyKnown', this.ndKnownToggle.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyUnknown') || !(this.ndUnknownToggle.checked == true)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_LinkifyUnknown', this.ndUnknownToggle.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyEmail') || !(this.ndEmailToggle.checked == true)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_LinkifyEmail', this.ndEmailToggle.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_TextProtocolList') || !(this.ndLinkifyTextProtocolList.value == this.ndWindow.objLinkify.sDefaultProtocol)) this.ndWindow.objLinkify.objLinkifyPrefs.setCharPref('Linkify_TextProtocolList', this.ndLinkifyTextProtocolList.value);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_SubdomainProtocolList') || !(this.ndLinkifySubdomainProtocolList.value == this.ndWindow.objLinkify.sDefaultSubdomain)) this.ndWindow.objLinkify.objLinkifyPrefs.setCharPref('Linkify_SubdomainProtocolList', this.ndLinkifySubdomainProtocolList.value);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_InlineElements') || !(this.ndLinkifyInlineElementList.value == this.ndWindow.objLinkify.sDefaultInlineElements)) this.ndWindow.objLinkify.objLinkifyPrefs.setCharPref('Linkify_InlineElements', this.ndLinkifyInlineElementList.value);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_ExcludeElements') || !(this.ndLinkifyExcludeElementList.value == this.ndWindow.objLinkify.sDefaultExcludeElements)) this.ndWindow.objLinkify.objLinkifyPrefs.setCharPref('Linkify_ExcludeElements', this.ndLinkifyExcludeElementList.value);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_Blacklist') || !(this.ndLinkifyBlacklist.checked == true)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_Blacklist', this.ndLinkifyBlacklist.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_Whitelist') || !(this.ndLinkifyWhitelist.checked == false)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_Whitelist', this.ndLinkifyWhitelist.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_SiteList') || !(this.ndLinkifySiteList.value == this.ndWindow.objLinkify.sDefaultSiteList)) this.ndWindow.objLinkify.objLinkifyPrefs.setCharPref('Linkify_SiteList', this.ndLinkifySiteList.value);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_CharLimitEnabled') || !(this.ndLinkifyCharLimitEnabled.checked == false)) this.ndWindow.objLinkify.objLinkifyPrefs.setBoolPref('Linkify_CharLimitEnabled', this.ndLinkifyCharLimitEnabled.checked);
		if (this.ndWindow.objLinkify.objLinkifyPrefs.prefHasUserValue('Linkify_CharLimit') || !(this.ndLinkifyCharLimit.value == 15000)) this.ndWindow.objLinkify.objLinkifyPrefs.setIntPref('Linkify_CharLimit', this.ndLinkifyCharLimit.value);
		this.ndWindow.objLinkify.Init();

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
		this.ndLinkifyTextProtocolList.value = this.ndWindow.objLinkify.sDefaultProtocol;

		return true;
	},

	LinkOptions_DefaultSubdomain: function()
	{
		this.ndLinkifySubdomainProtocolList.value = this.ndWindow.objLinkify.sDefaultSubdomain;

		return true;
	},

	LinkOptions_DefaultInline: function()
	{
		this.ndLinkifyInlineElementList.value = this.ndWindow.objLinkify.sDefaultInlineElements;

		return true;
	},

	LinkOptions_DefaultExclude: function()
	{
		this.ndLinkifyExcludeElementList.value = this.ndWindow.objLinkify.sDefaultExcludeElements;

		return true;
	},

	LinkOptions_DefaultSiteList: function()
	{
		this.ndLinkifySiteList.value = this.ndWindow.objLinkify.sDefaultSiteList;

		return true;
	}
};
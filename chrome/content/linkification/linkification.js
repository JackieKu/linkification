var objLinkify =
{
	objMozillaPrefs : Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch),
	objLinkifyPrefs : Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('linkification.settings.'),

	sDefaultTextColor : '#006620',
	sDefaultBackgroundColor : '#fff9ab',
	sDefaultProtocol : 'news:news,nntp:nntp,telnet:telnet,irc:irc,mms:mms,ed2k:ed2k,file:file,about:about!,mailto:mailto!,xmpp:xmpp!,h...s:https,f.p:ftp,h.?.?p:http',
	sDefaultSubdomain : 'www:http,ftp:ftp,irc:irc,jabber:xmpp!',
	sDefaultSiteList : 'localhost,google.com',
	sDefaultInlineElements : 'a,abbr,acronym,b,basefont,bdo,big,cite,code,dfn,em,font,i,kbd,label,nobr,q,s,samp,small,span,strike,strong,sub,sup,tt,u,wbr,var',
	sDefaultExcludeElements : "a,applet,area,embed,frame,frameset,head,iframe,img,map,meta,noscript,object,option,param,script,select,style,textarea,title,*[@onclick],*[@onmousedown],*[@onmouseup],*[@tiddler],*[@class='linkification-disabled']",

	sSelectedLink : '',

	nLinkified : 0,

	GetPreferences: function()
	{
		this.bThorough = this.objLinkifyPrefs.prefHasUserValue('Linkify_Thorough') ? this.objLinkifyPrefs.getBoolPref('Linkify_Thorough') : false;
		this.bAutoLinkify = this.objLinkifyPrefs.prefHasUserValue('Linkify_Toggle') ? this.objLinkifyPrefs.getBoolPref('Linkify_Toggle') : true;
		this.bDoubleClick = this.objLinkifyPrefs.prefHasUserValue('Linkify_DoubleClick') ? this.objLinkifyPrefs.getBoolPref('Linkify_DoubleClick') : true;
		this.bOpenSelected = this.objLinkifyPrefs.prefHasUserValue('Linkify_OpenSelected_Toggle') ? this.objLinkifyPrefs.getBoolPref('Linkify_OpenSelected_Toggle') : true;
		this.bContextMenu = this.objLinkifyPrefs.prefHasUserValue('Linkify_Popup_Toggle') ? this.objLinkifyPrefs.getBoolPref('Linkify_Popup_Toggle') : false;
		this.bStatusBar = this.objLinkifyPrefs.prefHasUserValue('Linkify_StatusBar_Toggle') ? this.objLinkifyPrefs.getBoolPref('Linkify_StatusBar_Toggle') : true;
		this.bTextColor = this.objLinkifyPrefs.prefHasUserValue('Linkify_HighlightText') ? this.objLinkifyPrefs.getBoolPref('Linkify_HighlightText') : false;
		this.bBackgroundColor = this.objLinkifyPrefs.prefHasUserValue('Linkify_HighlightBG') ? this.objLinkifyPrefs.getBoolPref('Linkify_HighlightBG') : false;
		this.sTextColor = this.objLinkifyPrefs.prefHasUserValue('Linkify_TextColor') ? this.objLinkifyPrefs.getCharPref('Linkify_TextColor') : this.sDefaultTextColor;
		this.sBackgroundColor = this.objLinkifyPrefs.prefHasUserValue('Linkify_BackgroundColor') ? this.objLinkifyPrefs.getCharPref('Linkify_BackgroundColor') : this.sDefaultBackgroundColor;
		this.bLinksOpenWindows = this.objLinkifyPrefs.prefHasUserValue('Linkify_OpenInWindow') ? this.objLinkifyPrefs.getBoolPref('Linkify_OpenInWindow') : false;
		this.bLinksOpenTabs = this.objLinkifyPrefs.prefHasUserValue('Linkify_OpenInTab') ? this.objLinkifyPrefs.getBoolPref('Linkify_OpenInTab') : false;
		this.bTabsOpenInBG = this.objLinkifyPrefs.prefHasUserValue('Linkify_OpenTabInBG') ? this.objLinkifyPrefs.getBoolPref('Linkify_OpenTabInBG') : false;
		this.bLinkifyImageURLs = this.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyImages') ? this.objLinkifyPrefs.getBoolPref('Linkify_LinkifyImages') : true;
		this.bLinkifyProtocol = this.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyProtocol') ? this.objLinkifyPrefs.getBoolPref('Linkify_LinkifyProtocol') : true;
		this.bLinkifyKnown = this.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyKnown') ? this.objLinkifyPrefs.getBoolPref('Linkify_LinkifyKnown') : true;
		this.bLinkifyUnknown = this.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyUnknown') ? this.objLinkifyPrefs.getBoolPref('Linkify_LinkifyUnknown') : true;
		this.bLinkifyEmail = this.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyEmail') ? this.objLinkifyPrefs.getBoolPref('Linkify_LinkifyEmail') : true;
		this.sProtocols = this.objLinkifyPrefs.prefHasUserValue('Linkify_TextProtocolList') ? this.objLinkifyPrefs.getCharPref('Linkify_TextProtocolList') : this.sDefaultProtocol;
		this.sSubDomains = this.objLinkifyPrefs.prefHasUserValue('Linkify_SubdomainProtocolList') ? this.objLinkifyPrefs.getCharPref('Linkify_SubdomainProtocolList') : this.sDefaultSubdomain;
		this.sInlineElements = this.objLinkifyPrefs.prefHasUserValue('Linkify_InlineElements') ? this.objLinkifyPrefs.getCharPref('Linkify_InlineElements') : this.sDefaultInlineElements;
		this.sExcludeElements = this.objLinkifyPrefs.prefHasUserValue('Linkify_ExcludeElements') ? this.objLinkifyPrefs.getCharPref('Linkify_ExcludeElements') : this.sDefaultExcludeElements;
		this.bUseBlacklist = this.objLinkifyPrefs.prefHasUserValue('Linkify_Blacklist') ? this.objLinkifyPrefs.getBoolPref('Linkify_Blacklist') : true;
		this.bUseWhitelist = this.objLinkifyPrefs.prefHasUserValue('Linkify_Whitelist') ? this.objLinkifyPrefs.getBoolPref('Linkify_Whitelist') : false;
		this.sSitelist = this.objLinkifyPrefs.prefHasUserValue('Linkify_SiteList') ? this.objLinkifyPrefs.getCharPref('Linkify_SiteList') : this.sDefaultSiteList;
		this.bEnableCharLimit = this.objLinkifyPrefs.prefHasUserValue('Linkify_CharLimitEnabled') ? this.objLinkifyPrefs.getBoolPref('Linkify_CharLimitEnabled') : false;
		this.nCharLimit = this.objLinkifyPrefs.prefHasUserValue('Linkify_CharLimit') ? this.objLinkifyPrefs.getIntPref('Linkify_CharLimit') : 15000;

		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_Thorough') && (this.bThorough == false)) this.objLinkifyPrefs.clearUserPref('Linkify_Thorough');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_Toggle') && (this.bAutoLinkify == true)) this.objLinkifyPrefs.clearUserPref('Linkify_Toggle');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_DoubleClick') && (this.bDoubleClick == true)) this.objLinkifyPrefs.clearUserPref('Linkify_DoubleClick');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_OpenSelected_Toggle') && (this.bOpenSelected == true)) this.objLinkifyPrefs.clearUserPref('Linkify_OpenSelected_Toggle');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_Popup_Toggle') && (this.bContextMenu == false)) this.objLinkifyPrefs.clearUserPref('Linkify_Popup_Toggle');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_StatusBar_Toggle') && (this.bStatusBar == true)) this.objLinkifyPrefs.clearUserPref('Linkify_StatusBar_Toggle');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_HighlightText') && (this.bTextColor == false)) this.objLinkifyPrefs.clearUserPref('Linkify_HighlightText');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_HighlightBG') && (this.bBackgroundColor == false)) this.objLinkifyPrefs.clearUserPref('Linkify_HighlightBG');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_TextColor') && (this.sTextColor == this.sDefaultTextColor)) this.objLinkifyPrefs.clearUserPref('Linkify_TextColor');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_BackgroundColor') && (this.sBackgroundColor == this.sDefaultBackgroundColor)) this.objLinkifyPrefs.clearUserPref('Linkify_BackgroundColor');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_OpenInWindow') && (this.bLinksOpenWindows == false)) this.objLinkifyPrefs.clearUserPref('Linkify_OpenInWindow');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_OpenInTab') && (this.bLinksOpenTabs == false)) this.objLinkifyPrefs.clearUserPref('Linkify_OpenInTab');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_OpenTabInBG') && (this.bTabsOpenInBG == false)) this.objLinkifyPrefs.clearUserPref('Linkify_OpenTabInBG');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyImages') && (this.bLinkifyImageURLs == true)) this.objLinkifyPrefs.clearUserPref('Linkify_LinkifyImages');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyProtocol') && (this.bLinkifyProtocol == true)) this.objLinkifyPrefs.clearUserPref('Linkify_LinkifyProtocol');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyKnown') && (this.bLinkifyKnown == true)) this.objLinkifyPrefs.clearUserPref('Linkify_LinkifyKnown');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyUnknown') && (this.bLinkifyUnknown == true)) this.objLinkifyPrefs.clearUserPref('Linkify_LinkifyUnknown');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_LinkifyEmail') && (this.bLinkifyEmail == true)) this.objLinkifyPrefs.clearUserPref('Linkify_LinkifyEmail');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_TextProtocolList') && (this.sProtocols == this.sDefaultProtocol)) this.objLinkifyPrefs.clearUserPref('Linkify_TextProtocolList');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_SubdomainProtocolList') && (this.sSubDomains == this.sDefaultSubdomain)) this.objLinkifyPrefs.clearUserPref('Linkify_SubdomainProtocolList');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_InlineElements') && (this.sInlineElements == this.sDefaultInlineElements)) this.objLinkifyPrefs.clearUserPref('Linkify_InlineElements');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_ExcludeElements') && (this.sExcludeElements == this.sDefaultExcludeElements)) this.objLinkifyPrefs.clearUserPref('Linkify_ExcludeElements');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_Blacklist') && (this.bUseBlacklist == true)) this.objLinkifyPrefs.clearUserPref('Linkify_Blacklist');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_Whitelist') && (this.bUseWhitelist == false)) this.objLinkifyPrefs.clearUserPref('Linkify_Whitelist');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_SiteList') && (this.sSitelist == this.sDefaultSiteList)) this.objLinkifyPrefs.clearUserPref('Linkify_SiteList');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_CharLimitEnabled') && (this.bEnableCharLimit == false)) this.objLinkifyPrefs.clearUserPref('Linkify_CharLimitEnabled');
		if (this.objLinkifyPrefs.prefHasUserValue('Linkify_CharLimit') && (this.nCharLimit == 15000)) this.objLinkifyPrefs.clearUserPref('Linkify_CharLimit');

		return true;
	},

	InitServices: function()
	{
		window.addEventListener('load', objLinkify.InitServices, false);
		objLinkify.objStringBundle = document.getElementById('linkification-string-bundle');

 		document.getElementById('contentAreaContextMenu').addEventListener('popupshowing', objLinkify.PopupShowing, false);

		objLinkify.Init();

		if (typeof(getBrowser) != 'undefined')
		{
			var ndBrowser = getBrowser();
			ndBrowser.addEventListener('click', objLinkify.WindowClick, true);
			ndBrowser.addEventListener('dblclick', objLinkify.WindowDoubleClick, false);
			ndBrowser.addEventListener('load', objLinkify.AutoLinkify, true);
			ndBrowser.addEventListener('focus', objLinkify.WindowFocus, true);
		}

		return true;
	},

	Init: function()
	{
		this.GetPreferences();

		if (this.bStatusBar)
		{
			document.getElementById('linkification-status').setAttribute('collapsed', 'false');
		}
		else
		{
			document.getElementById('linkification-status').setAttribute('collapsed', 'true');
		}

		this.aExcludeElements = this.sExcludeElements.split(',');
		this.aInlineElements = this.sInlineElements.split(',');
		this.aInlineHash = Array();
		for (ctr = 0; ctr < this.aInlineElements.length; ++ctr)
		{
			this.aInlineHash[this.aInlineElements[ctr]] = true;
		}

		this.aProtocol = Array();
		this.aRecognizeProtocolAs = Array();

		var aTextLinkProtocol;
		var aTextProtocolList = this.sProtocols.split(',');
		var ctr;
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

				this.aProtocol.push(aTextLinkProtocol[0]);
				this.aRecognizeProtocolAs.push(aTextLinkProtocol[1]);
			}
		}

		this.aSubDomain = Array();
		this.aRecognizeSubDomainAs = Array();

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

				this.aSubDomain.push(aTextLinkProtocol[0]);
				this.aRecognizeSubDomainAs.push(aTextLinkProtocol[1]);
			}
		}

		var sProtocol = '(' + this.aProtocol.join('|') + ')';
		var sSubDomain = '(' + this.aSubDomain.join('|') + ')';

		var sAlphanumeric = '[^`~!@#$%^&*()_=+\\[{\\]}\\\\|;:\'",<.>\\/?\\s]';

		var sURLPathChars = '[^\\^\\[\\]{}|\\\\\'"<>`\\s]';
		var sEndChars = '[^!@\\^()\\[\\]{}|\\\\:;\'",.?<>`\\s]';
		var sUserNamePasswordChars = '[^@:<>(){}`\'"\\/\\[\\]\\s]';
		var sGetStringChars = '[^\\^*\\[\\]{}|\\\\"<>\\/`\\s]';

		var sTopLevelDomains = '[a-z]{2,6}';
		var sIPv4Address = '(?:(?:(?:[0-1]?[0-9]?[0-9])|(?:2[0-4][0-9])|(?:25[0-5]))(?:\\.(?:(?:[0-1]?[0-9]?[0-9])|(?:2[0-4][0-9])|(?:25[0-5]))){3})';
		var sIPv6Address = '(?:[A-Fa-f0-9:]{16,39})';
		var sIPAddress = '(?:' + sIPv4Address + '|' + sIPv6Address + ')';
		var sAllSubDomain = sAlphanumeric + '+';
		var sURLPath = sURLPathChars + '*' + sEndChars;

		var sWWWAuth = '(?:(?:(?:' + sUserNamePasswordChars + '+:)?' + sUserNamePasswordChars + '+@)?' + sSubDomain + '\\.(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + '(?:[/#?](?:' + sURLPath + ')?)?)';
		var sOtherOptionalAuth = '(?:(?:' + sUserNamePasswordChars + '+@)?(' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + '))\/(?:' + sURLPath + '(?:[#?](?:' + sURLPath + ')?)?)?)';
		var sOtherAuth = '(?:' + sUserNamePasswordChars + '+:' + sUserNamePasswordChars + '+@(' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + '))(?:\/(?:(?:' + sURLPath + ')?)?)?(?:[#?](?:' + sURLPath + ')?)?)';

		var sRegExpHTTP = '(?:' + sProtocol + sURLPath + ')';
		var sRegExpWWW = '(?:' + sWWWAuth + '|' + sOtherOptionalAuth + '|' + sOtherAuth + ')';
		var sRegExpEmail = '(' + sUserNamePasswordChars + '+@' + '(?:(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + ')|(?:' + sIPAddress + '))(?:' + sGetStringChars + '+' + sEndChars + ')?)';
		this.sRegExpAll = RegExp(sRegExpHTTP + '|' + sRegExpWWW + '|' + sRegExpEmail, 'i');

		sOtherOptionalAuth = '(?:(?:[^*=/<>(){}\\[\\]\\s]+@)?((' + sIPAddress + '|(?:(?:' + sAllSubDomain + '\\.)+' + sTopLevelDomains + ')))(?:/(?:' + sURLPath + ')?)?(?:[#?](?:' + sURLPath + ')?)?)';
		sRegExpWWW = '(?:' + sWWWAuth + '|' + sOtherOptionalAuth + ')';
		this.sRegExpSelected = RegExp('^(?:' + sRegExpHTTP + '|' + sRegExpEmail + '|' + sRegExpWWW + ')$', 'i');

		this.sXPath = '//text()[not(ancestor::' + this.aExcludeElements.join(' or ancestor::') + ') and (';
		for (ctr = 0; ctr < this.aSubDomain.length; ++ctr)
		{
			this.sXPath += "contains(translate(., '" + this.aSubDomain[ctr].toUpperCase() + "', '" + this.aSubDomain[ctr].toLowerCase() + "'), '" + this.aSubDomain[ctr].toLowerCase() + "') or ";
		}
		this.sXPath += "contains(., '@') or contains(., '/') or contains(., ':'))]";

		return true;
	},

	WindowClick: function(e)
	{
		var ndClicked;

		if (e.button == 2)
		{
			ndClicked = e.target;

			var ndMenu = document.getElementById('linkification-contextmenu');
			if (!objLinkify.bContextMenu || (ndClicked.nodeName == 'TEXTAREA') || (ndClicked.nodeName == 'INPUT') || (ndClicked.nodeName == 'A'))
			{
				ndMenu.setAttribute('collapsed', 'true');
				return true;
			}

			ndMenu.setAttribute('collapsed', 'false');
			return true;
		}

		ndClicked = objLinkify.GetParent(e.originalTarget, 'a');
		if (!ndClicked.hasAttribute || !ndClicked.hasAttribute('class') || (ndClicked.getAttribute('class') != 'linkification-ext'))
		{
			return true;
		}

		if (((e.button == 0) || (e.button == 1)) && !e.shiftKey && !e.altKey)
		{
			if (objLinkify.ClickLink(ndClicked.href, e.button, e.metaKey || e.ctrlKey))
			{
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		}

		return true;
	},

	WindowDoubleClick: function(e)
	{
		if (!objLinkify.bDoubleClick)
		{
			return false;
		}

		var ndDblClicked = e.originalTarget;
		if ((ndDblClicked.nodeName == 'tab')
		|| (ndDblClicked.nodeName == 'xul:spacer')
		|| (ndDblClicked.nodeName == 'toolbar'))
		{
			return false;
		}

		var ndDocument = objLinkify.GetParent(ndDblClicked, '#document');

		var ndWindow = gBrowser.contentWindow;
		if (ndWindow.document != ndDocument)
		{
			if (ndWindow.frames.length > 0)
			{
				ndWindow = objLinkify.FindFrame(ndWindow, ndDocument);
			}
			else
			{
				return false;
			}
		}

		if ((ndWindow == false) || (typeof(ndWindow.getSelection) == 'undefined'))
		{
			return false;
		}

		var objSelection = ndWindow.getSelection();
		if (!objSelection || objSelection.isCollapsed || !objSelection.anchorNode || (objSelection.anchorNode.nodeName != '#text'))
		{
			return false;
		}

		objLinkify.DoubleClickLink(objSelection);

		return true;
	},

	AutoLinkify: function(objEvent)
	{
		var ndDocument = objEvent.originalTarget;
		var aBodyTags = ndDocument.getElementsByTagName('body');
		var ndBody = (aBodyTags.length > 0) ? aBodyTags[0] : false;

		if (!objLinkify.bAutoLinkify || !ndBody || (ndBody.getAttribute('linkifying') == true))
		{
			return false;
		}
		ndBody.setAttribute('linkifying', true);

		var sHost = objLinkify.GetHost(ndDocument);
		var sLocation = objLinkify.GetSiteListed(sHost);

		if ((!sLocation && objLinkify.bUseWhitelist) || (sLocation && objLinkify.bUseBlacklist))
		{
			return false;
		}

		if (objLinkify.bEnableCharLimit)
		{
			var objRange = document.createRange();
			objRange.setEnd(ndBody, ndBody.childNodes.length);
			objRange.setStart(ndBody, 0);

			var nPageLength = objRange.toString().length;
			objRange.detach();
			if (nPageLength > objLinkify.nCharLimit)
			{
				return false;
			}
		}

		if (objLinkify.bThorough)
		{
			objLinkify.Linkify_Thorough(ndDocument);
		}
		else
		{
			objLinkify.Linkify_Simple(ndDocument);
		}
		return true;
	},

	WindowFocus: function()
	{
		objLinkify.SetLinkified();
	},

	PopupShowing: function(e)
	{
		var ndOpen = document.getElementById('linkification-contextmenu-open');
		objLinkify.sSelectedLink = objLinkify.GetSelectedText();

		if (objLinkify.bOpenSelected && (objLinkify.sSelectedLink.length > 0))
		{
			ndOpen.setAttribute('collapsed', 'false');
		}
		else
		{
			ndOpen.setAttribute('collapsed', 'true');
		}

		if (!objLinkify.bContextMenu)
		{
			return true;
		}

		var ndLinkify = document.getElementById('linkification-contextmenu-linkify');
		if (objLinkify.nLinkified > 0)
		{
			ndLinkify.setAttribute('label', objLinkify.objStringBundle.getString('linkification_popup_unlinkifypage'));
		}
		else
		{
			ndLinkify.setAttribute('label', objLinkify.objStringBundle.getString('linkification_popup_linkifypage'));
		}

		var sHost = objLinkify.GetHost();
		var sLocation = objLinkify.GetSiteListed(sHost);

		var ndList = document.getElementById('linkification-contextmenu-listoption');
		ndList.setAttribute('collapsed', 'true');

		if ((!objLinkify.bUseWhitelist &&	!objLinkify.bUseBlacklist) || !sHost)
		{
			return true;
		}

		var sList;
		if (sLocation)
		{
			sList = objLinkify.bUseWhitelist ? objLinkify.objStringBundle.getString('linkification_status_whitelist_remove') : objLinkify.objStringBundle.getString('linkification_status_blacklist_remove');
			sList = sList.replace('xxxxxxx', "'" + sLocation + "'");
		}
		else
		{
			sList = objLinkify.bUseWhitelist ? objLinkify.objStringBundle.getString('linkification_status_whitelist_add') : objLinkify.objStringBundle.getString('linkification_status_blacklist_add');
			sList = sList.replace('xxxxxxx', "'" + sHost + "'");
		}

		ndList.setAttribute('label', sList);
		ndList.setAttribute('collapsed', 'false');

		return true;
	},

	InitStatusMenu: function()
	{
		var ndLinkify = document.getElementById('linkification-status-linkify');
		if (objLinkify.nLinkified > 0)
		{
			ndLinkify.setAttribute('label', objLinkify.objStringBundle.getString('linkification_popup_unlinkifypage'));
		}
		else
		{
			ndLinkify.setAttribute('label', objLinkify.objStringBundle.getString('linkification_popup_linkifypage'));
		}

		var sHost = objLinkify.GetHost();
		var sLocation = objLinkify.GetSiteListed(sHost);

		var ndList = document.getElementById('linkification-status-listoption');
		ndList.setAttribute('collapsed', 'true');

		if ((!objLinkify.bUseWhitelist &&	!objLinkify.bUseBlacklist) || !sHost)
		{
			return true;
		}

		var sList;
		if (sLocation)
		{
			sList = objLinkify.bUseWhitelist ? objLinkify.objStringBundle.getString('linkification_status_whitelist_remove') : objLinkify.objStringBundle.getString('linkification_status_blacklist_remove');
			sList = sList.replace('xxxxxxx', "'" + sLocation + "'");
		}
		else
		{
			sList = objLinkify.bUseWhitelist ? objLinkify.objStringBundle.getString('linkification_status_whitelist_add') : objLinkify.objStringBundle.getString('linkification_status_blacklist_add');
			sList = sList.replace('xxxxxxx', "'" + sHost + "'");
		}

		ndList.setAttribute('label', sList);
		ndList.setAttribute('collapsed', 'false');

		return true;
	},

	UserLinkify: function()
	{
		if (this.bFromPopup)
		{
			return false;
		}

		this.bFromPopup = true;

		var ndDocument, ndBody, aBodyTags;

		this.GetWindows(gBrowser.contentWindow);
		for (var ctr = 0; ctr < this.aFrameWindows.length; ++ctr)
		{
			ndDocument = this.aFrameWindows[ctr].document;
			aBodyTags = ndDocument.getElementsByTagName('body');
			ndBody = (aBodyTags.length > 0) ? aBodyTags[0] : false;

			if (!ndBody || (ndBody.getAttribute('linkifying') == true))
			{
				continue;
			}
			ndBody.setAttribute('linkifying', true);

			if (this.nLinkified > 0)
			{
				this.Undo(ndDocument);
			}
			else
			{
				if (this.bThorough)
				{
					this.Linkify_Thorough(ndDocument);
				}
				else
				{
					this.Linkify_Simple(ndDocument);
				}
			}
		}

		this.bFromPopup = false;

		return true;
	},

	Linkify_Thorough: function(ndRoot)
	{
		var ndDocument = this.GetParent(ndRoot, '#document');
		var ndBody = ndDocument.getElementsByTagName('body')[0];

		var ndNode = ndRoot;
		while (ndNode.nodeName != '#document')
		{
			if (this.IsExcluded(ndDocument, ndNode))
			{
				return true;
			}
			ndNode = ndNode.parentNode;
		}
		ndNode = null;

		var objStartTime = new Date();

		ndBody.setAttribute('linkifycurrent', 0);
		ndBody.setAttribute('linkifymax', 0);
		ndBody.setAttribute('linkifytraversed', 'false');

		this.TraverseNodes(ndDocument, ndBody, ndRoot, ndRoot, false, [], '', objStartTime);

		return true;
	},

	TraverseNodes: function(ndDocument, ndBody, ndRoot, ndNode, bChildrenDone, aTraverseNodes, sTraverseText, objStartTime)
	{
		var ndContinue;

		for (var nIterations = 0; (ndNode && (nIterations < 75)); ++nIterations)
		{
			if (ndNode.nodeName == '#text')
			{
				if (!bChildrenDone)
				{
					aTraverseNodes.push(ndNode);
					sTraverseText += ndNode.nodeValue;
				}
			}
			else if (aTraverseNodes.length && ndNode.nodeName && !objLinkify.aInlineHash[ndNode.nodeName.toLowerCase()])
			{
				ndBody.setAttribute('linkifymax', (parseInt(ndBody.getAttribute('linkifymax'), 10) + 1));
				objLinkify.CreateLinks_Thorough(ndDocument, ndBody, aTraverseNodes, sTraverseText, objStartTime);
				aTraverseNodes = [];
				sTraverseText = '';
			}

			if (bChildrenDone && (ndNode == ndRoot))
			{
				break;
			}
			else if (!bChildrenDone && ndNode.firstChild && !objLinkify.IsExcluded(ndDocument, ndNode))
			{
				ndNode = ndNode.firstChild;
			}
			else
			{
				if (ndNode.nextSibling)
				{
					ndNode = ndNode.nextSibling;
					bChildrenDone = false;
				}
				else
				{
					ndNode = ndNode.parentNode;
					bChildrenDone = true;
				}
			}
		}

		if (ndNode && (ndNode != ndRoot))
		{
			setTimeout(objLinkify.TraverseNodes, 20, ndDocument, ndBody, ndRoot, ndNode, bChildrenDone, aTraverseNodes, sTraverseText, objStartTime);
			return true;
		}

		objLinkify.Linkify_Thorough_End(ndDocument, objStartTime, true);
		return true;
	},

	CreateLinks_Thorough: function(ndDocument, ndBody, aTraverseNodes, sTraverseText, objStartTime)
	{
		var aMatch, sStyle, sHREF, nIndex, nTextLength, objRange, ndStart, ndEnd, nRangeStart, nRangeEnd, nSearch, ndAnchor;
		var ndReturn = null;
		var nIterations = 0;

		while ((aMatch = objLinkify.sRegExpAll.exec(sTraverseText)) && (nIterations++ < 20))
		{
			sHREF = objLinkify.GetLinkHREF(aMatch);

			nTextLength = 0;
			nIndex = 0;
			nSearch = aMatch.index;
			while (nSearch > (nTextLength + aTraverseNodes[nIndex].nodeValue.length))
			{
				nTextLength += aTraverseNodes[nIndex++].nodeValue.length;
			}
			ndStart = aTraverseNodes[nIndex];
			nRangeStart = nSearch - nTextLength;

			nSearch = aMatch.index + aMatch[0].length;
			while (nSearch > (nTextLength + aTraverseNodes[nIndex].nodeValue.length))
			{
				nTextLength += aTraverseNodes[nIndex++].nodeValue.length;
			}
			ndEnd = aTraverseNodes[nIndex];
			nRangeEnd = nSearch - nTextLength;

			if (objLinkify.IsImage(sHREF) && (!objLinkify.bLinkifyImageURLs)
			|| (aMatch[1] && !objLinkify.bLinkifyProtocol)
			|| (aMatch[2] && !objLinkify.bLinkifyKnown)
			|| ((aMatch[3] || aMatch[4]) && !objLinkify.bLinkifyUnknown)
			|| (aMatch[5] && !objLinkify.bLinkifyEmail))
			{
				aTraverseNodes[nIndex].splitText(nSearch - nTextLength);
				aTraverseNodes[nIndex] = aTraverseNodes[nIndex].nextSibling;

				ndReturn = aTraverseNodes[nIndex];

				aTraverseNodes.splice(0, nIndex);
				sTraverseText = sTraverseText.substr(nSearch);

				continue;
			}

			objRange = document.createRange();
			objRange.setStart(ndStart, nRangeStart);
			objRange.setEnd(ndEnd, nRangeEnd);

			ndAnchor = ndDocument.createElement('a');
			ndAnchor.setAttribute('title', 'Linkification: ' + sHREF);
			ndAnchor.setAttribute('href', sHREF);
			ndAnchor.setAttribute('class', 'linkification-ext');
			sStyle = (objLinkify.bTextColor) ? 'color:' + objLinkify.sTextColor : '';
			if (objLinkify.bBackgroundColor)
			{
				sStyle += (sStyle.length > 0) ? '; ' : '';
				sStyle += 'background-color:' + objLinkify.sBackgroundColor;
			}

			if (sStyle.length > 0)
			{
				ndAnchor.setAttribute('style', sStyle);
			}

			ndAnchor.appendChild(objRange.extractContents());
			objRange.insertNode(ndAnchor);

			objRange.detach();

			ndReturn = ndAnchor.nextSibling;
			if ((ndAnchor.nextSibling) && (ndAnchor.nextSibling.nodeName == '#text'))
			{
				aTraverseNodes.splice(0, nIndex + 1, ndAnchor.nextSibling);
			}
			else
			{
				aTraverseNodes.splice(0, nIndex + 1);
			}
			sTraverseText = sTraverseText.substr(nSearch);
		}

		if (aMatch)
		{
			setTimeout(objLinkify.CreateLinks_Thorough, 10, ndDocument, ndBody, aTraverseNodes, sTraverseText, objStartTime);
			return true;
		}

		ndBody.setAttribute('linkifycurrent', (parseInt(ndBody.getAttribute('linkifycurrent'), 10) + 1));
		objLinkify.Linkify_Thorough_End(ndDocument, objStartTime, false);
		return true;
	},

	Linkify_Thorough_End: function(ndDocument, objStartTime, bTraversed)
	{
		var ndBody = ndDocument.getElementsByTagName('body')[0];

		if (bTraversed)
		{
			ndBody.setAttribute('linkifytraversed', 'true');
		}

		if ((ndBody.getAttribute('linkifytraversed') == 'false') || (parseInt(ndBody.getAttribute('linkifycurrent'), 10) != parseInt(ndBody.getAttribute('linkifymax'), 10)))
		{
			return false;
		}

		var objStopTime = new Date();

		var aAttributes = Array();
		aAttributes['class'] = 'linkification-ext';

		ndBody.setAttribute('linkified', this.GetElementsByAttributes(ndDocument, aAttributes).length);
		ndBody.setAttribute('linkifytime', (objStopTime.getTime() - objStartTime.getTime()));
		ndBody.setAttribute('linkifying', false);
		ndBody.removeAttribute('linkifytraversed');
		ndBody.removeAttribute('linkifycurrent');
		ndBody.removeAttribute('linkifymax');

		this.SetLinkified();

		delete objStartTime;
		delete objStopTime;
		objStartTime = objStopTime = null;
		return true;
	},

	Linkify_Simple: function(ndDocument)
	{
		var ndBody = ndDocument.getElementsByTagName('body')[0];
		var objStartTime = new Date();

		var objResult = this.XPathQuery(this.sXPath, ndDocument);

		ndBody.setAttribute('linkifycurrent', 0);
		ndBody.setAttribute('linkifymax', objResult.snapshotLength);
		for (var ctr = 0; ctr < objResult.snapshotLength; ++ctr)
		{
			this.CreateLinks_Simple(ndDocument, objResult.snapshotItem(ctr), ctr, objStartTime);
		}

		return true;
	},

	CreateLinks_Simple: function(ndDocument, ndText, nProgressIndex, objStartTime)
	{
		var sHREF;
		var sSource = ndText.nodeValue;
		var ndParent = ndText.parentNode;
		var ndNextSibling = ndText.nextSibling;

		for (var aMatch = null, bMatched = false, nIterations = 0, nNodeLinks = 0; (nIterations < 3) && (aMatch = objLinkify.sRegExpAll.exec(sSource)); ++nIterations)
		{
			if (!bMatched)
			{
				bMatched = true;
				ndParent.removeChild(ndText);
			}

			ndParent.insertBefore(ndDocument.createTextNode(sSource.substring(0, aMatch.index)), ndNextSibling);
			sHREF = objLinkify.GetLinkHREF(aMatch);

			if (objLinkify.IsImage(sHREF) && (!objLinkify.bLinkifyImageURLs)
			|| (aMatch[1] && !objLinkify.bLinkifyProtocol)
			|| (aMatch[2] && !objLinkify.bLinkifyKnown)
			|| ((aMatch[3] || aMatch[4]) && !objLinkify.bLinkifyUnknown)
			|| (aMatch[5] && !objLinkify.bLinkifyEmail))
			{
				ndParent.insertBefore(ndDocument.createTextNode(aMatch[0]), ndNextSibling);
				sSource = sSource.substr(aMatch.index + aMatch[0].length);
				continue;
			}

			var ndAnchor = ndDocument.createElement('a');
			ndAnchor.setAttribute('title', 'Linkification: ' + sHREF);
			ndAnchor.setAttribute('href', sHREF);
			ndAnchor.setAttribute('class', 'linkification-ext');

			var sStyle = (objLinkify.bTextColor) ? 'color:' + objLinkify.sTextColor : '';
			if (objLinkify.bBackgroundColor)
			{
				sStyle += (sStyle.length > 0) ? '; ' : '';
				sStyle += 'background-color:' + objLinkify.sBackgroundColor;
			}

			if (sStyle.length > 0)
			{
				ndAnchor.setAttribute('style', sStyle);
			}

			ndAnchor.appendChild(ndDocument.createTextNode(aMatch[0]));
			ndParent.insertBefore(ndAnchor, ndNextSibling);

			sSource = sSource.substr(aMatch.index + aMatch[0].length);
			++nNodeLinks;
		}

		if (bMatched)
		{
			var ndAfter = ndDocument.createTextNode(sSource);
			ndParent.insertBefore(ndAfter, ndNextSibling);
		}

		if (nIterations == 3)
		{
			setTimeout(objLinkify.CreateLinks_Simple, 20, ndDocument, ndAfter, nProgressIndex, objStartTime);
			return true;
		}

		var ndBody = ndDocument.getElementsByTagName('body')[0];
		var nLinkified = parseInt(ndBody.getAttribute('linkifycurrent'), 10);
		ndBody.setAttribute('linkifycurrent', (nLinkified + 1));

		if ((nLinkified + 1) < parseInt(ndBody.getAttribute('linkifymax'), 10))
		{
			return true;
		}

		objLinkify.Linkify_Simple_End(ndDocument, objStartTime);
		return true;
	},

	Linkify_Simple_End: function(ndDocument, objStartTime)
	{
		var ndBody = ndDocument.getElementsByTagName('body')[0];

		var objStopTime = new Date();

		var aAttributes = Array();
		aAttributes['class'] = 'linkification-ext';

		ndBody.setAttribute('linkified', this.GetElementsByAttributes(ndDocument, aAttributes).length);
		ndBody.setAttribute('linkifytime', objStopTime.getTime() - objStartTime.getTime());
		ndBody.setAttribute('linkifying', false);
		ndBody.removeAttribute('linkifycurrent');
		ndBody.removeAttribute('linkifymax');

		this.SetLinkified();

		delete objStartTime;
		delete objStopTime;
		objStartTime = objStopTime = null;
		return true;
	},

	SplitNodes: function(ndText, nTextLength)
	{
		var sRegExpSpace = /\s/;
		var sSource, aMatch;

		while (ndText.nodeValue.length > nTextLength)
		{
			sSource = ndText.nodeValue.substr(nTextLength);
			aMatch = sRegExpSpace.exec(sSource);
			if (!aMatch)
			{
				return true;
			}

			ndText.splitText(nTextLength + aMatch.index);
			ndText = ndText.nextSibling;
		}

		return true;
	},

	GetSelectedText: function()
	{
		var ndWindow, objSelection;

		this.GetWindows(gBrowser.contentWindow);
		for (var ctr = 0; ctr < this.aFrameWindows.length; ++ctr)
		{
			objSelection = this.aFrameWindows[ctr].getSelection();
			if (!objSelection || objSelection.isCollapsed || !objSelection.anchorNode || (objSelection.anchorNode.nodeName != '#text'))
			{
				objSelection = false;
			}
			else
			{
				break;
			}
		}

		if (!objSelection)
		{
			return '';
		}

		var sSelectedText = objSelection.toString().replace(/\s/g, '');
		if (sSelectedText.length == 0)
		{
			return '';
		}

		return this.GetSelectedLinkHREF(sSelectedText);
	},

	GetSelectedLinkHREF: function(sSelectedText)
	{
		var aMatch = this.sRegExpSelected.exec(sSelectedText);

		if (aMatch)
		{
			if (aMatch[1])
			{
				return aMatch[0].replace(aMatch[1], this.GetProtocol(aMatch[1]));
			}
			else if (aMatch[2])
			{
				return 'mailto:' + aMatch[0];
			}
			else if (aMatch[3])
			{
				return this.GetDomainProtocol(aMatch[3]) + aMatch[0];
			}
			else if (aMatch[4])
			{
				return this.GetDomainProtocol(aMatch[4]) + aMatch[0];
			}
			else if (aMatch[5])
			{
				return this.GetDomainProtocol(aMatch[5]) + aMatch[0];
			}
		}

		return sSelectedText;
	},

	GetLinkHREF: function(aMatch)
	{
		var sHREF = '';
		if (aMatch[1])
		{
			sHREF = aMatch[0].replace(aMatch[1], this.GetProtocol(aMatch[1]));
			if (sHREF.match(/^http:\/\/anonym\.to\/?\?.+/i)) sHREF = sHREF.replace(/^http:\/\/anonym\.to\/?\?/i, '');
		}
		else if (aMatch[2])
		{
			sHREF = this.GetDomainProtocol(aMatch[2]) + aMatch[0];
		}
		else if (aMatch[3])
		{
			sHREF = this.GetDomainProtocol(aMatch[3]) + aMatch[0];
		}
		else if (aMatch[4])
		{
			sHREF = this.GetDomainProtocol(aMatch[4]) + aMatch[0];
		}
		else if (aMatch[5])
		{
			sHREF = 'mailto:' + aMatch[0];
		}

		return sHREF;
	},

	Undo: function(ndDocument)
	{
		var ndBody = ndDocument.getElementsByTagName('body')[0];
		if (ndBody.getAttribute('linkifying') == true)
		{
			return true;
		}
		ndBody.setAttribute('linkifying', true);

		var ndParent;

		var aAttributes = Array();
		aAttributes['class'] = 'linkification-ext';
		var aAnchors = this.GetElementsByAttributes(ndDocument, aAttributes);

		for (var ctr = aAnchors.length - 1; ctr >= 0; --ctr)
		{
			ndParent = aAnchors[ctr].parentNode;
			while (aAnchors[ctr].firstChild)
			{
				ndParent.insertBefore(aAnchors[ctr].removeChild(aAnchors[ctr].firstChild), aAnchors[ctr]);
			}
			ndParent.removeChild(aAnchors[ctr]);
		}

		ndBody.removeAttribute('linkified');
		ndBody.removeAttribute('linkifytime');
		ndBody.setAttribute('linkifying', false);

		this.SetLinkified();

		return true;
	},

	GetProtocol: function(sProtocolMatch)
	{
		var reTest;
		for (var ctr = 0; ctr < this.aProtocol.length; ++ctr)
		{
			reTest = RegExp('^' + this.aProtocol[ctr] + '$', 'i');
			if (reTest.test(sProtocolMatch))
			{
				return this.aRecognizeProtocolAs[ctr];
			}
		}

		return true;
	},

	GetDomainProtocol: function(sSubdomain)
	{
		var reTest;
		for (var ctr = 0; ctr < this.aSubDomain.length; ++ctr)
		{
			reTest = RegExp('^' + this.aSubDomain[ctr] + '$', 'i');
			if (reTest.test(sSubdomain))
			{
				return this.aRecognizeSubDomainAs[ctr];
			}
		}

		return 'http://';
	},

	IsImage: function(sFile)
	{
		sFile = (sFile.indexOf('?') > -1) ? sFile.substr(0, sFile.indexOf('?')) : sFile;
		sFile = (sFile.indexOf('#') > -1) ? sFile.substr(0, sFile.indexOf('#')) : sFile;
		sFile = (sFile.lastIndexOf('.') > -1) ? sFile.substr(sFile.lastIndexOf('.')) : sFile;

		return ((sFile == '.jpeg') || (sFile == '.jpg') || (sFile == '.gif') || (sFile == '.png') || (sFile == '.bmp'));
	},

	SetLinkified: function()
	{
		this.nLinkified = 0;
		this.nLinkifyTime = 0;

		var ndDocument, ndBody, aBodyTags;

		this.GetWindows(gBrowser.contentWindow);
		for (var ctr = 0; ctr < this.aFrameWindows.length; ++ctr)
		{
			ndDocument = this.aFrameWindows[ctr].document;
			aBodyTags = ndDocument.getElementsByTagName('body');
			ndBody = (aBodyTags.length > 0) ? aBodyTags[0] : false;

			if (ndBody === false)
			{
				continue;
			}

			if (ndBody.hasAttribute && ndBody.hasAttribute('linkified') && ndBody.getAttribute('linkified'))
			{
				this.nLinkified += parseInt(ndBody.getAttribute('linkified'), 10);
				this.nLinkifyTime += parseInt(ndBody.getAttribute('linkifytime'), 10);
			}
		}

		var ndStatus = document.getElementById('linkification-status-hbox');
		if (this.nLinkified > 0)
		{
			ndStatus.setAttribute('tooltiptext', this.objStringBundle.getString('linkification_statusbartooltip') + ' ' + this.nLinkified + ' (' + parseInt(this.nLinkifyTime, 10) + 'ms)');
		}
		else
		{
			ndStatus.setAttribute('tooltiptext', this.objStringBundle.getString('linkification_statusbartooltip') + ' ' + this.nLinkified);
		}
		ndStatus.src = (this.nLinkified > 0) ? 'chrome://linkification/skin/link-on.png' : 'chrome://linkification/skin/link-off.png';

		return true;
	},

	ToggleLinkify: function()
	{
		this.objLinkifyPrefs.setBoolPref('Linkify_Toggle', !this.bAutoLinkify);
		this.bAutoLinkify = !this.bAutoLinkify;

		return true;
	},

	ClickLink: function(sHREF, nButton, bCtrlKey)
	{
		var bTabDefault = (this.objMozillaPrefs.getPrefType('browser.tabs.loadInBackground') == this.objMozillaPrefs.PREF_BOOL) ? this.objMozillaPrefs.getBoolPref('browser.tabs.loadInBackground') : true;
		var bOpenWindow = this.bLinksOpenWindows;
		var bOpenTab = (this.bLinksOpenTabs || (nButton == 1) || bCtrlKey);

		if (sHREF.indexOf(':') > -1)
		{
			var sProtocol = sHREF.substr(0, sHREF.indexOf(':')).toLowerCase();
			if ((sProtocol != 'http') && (sProtocol != 'https') && (sProtocol != 'ftp') && (sProtocol != 'about'))
			{
				bOpenWindow = false;
				bOpenTab = false;
			}
		}

		if (bOpenWindow)
		{
			window.open(sHREF);
		}
		else if (bOpenTab)
		{
			var objTab = gBrowser.addTab(sHREF, null, null);
			if (((nButton != 1) && !bCtrlKey && this.bLinksOpenTabs && !this.bTabsOpenInBG) || (((nButton == 1) || bCtrlKey) && !bTabDefault))
			{
				gBrowser.selectedTab = objTab;
			}
		}
		else
		{
			gBrowser.loadURI(sHREF, null, null);
		}

		return true;
	},

	OpenSelected: function()
	{
		return this.ClickLink(this.sSelectedLink, 0);
	},

	ListSite: function()
	{
		var sHost = this.GetHost();
		if (!sHost)
		{
			return false;
		}

		var sLocation = this.GetSiteListed(sHost);
		var aSiteList = this.sSitelist.split(',');

		if (sLocation)
		{
			var aNewList = Array();
			for (var ctr = 0; ctr < aSiteList.length; ++ctr)
			{
				if (aSiteList[ctr] != sLocation)
				{
					aNewList.push(aSiteList[ctr]);
				}
			}
			this.sSitelist = aNewList.join(',');
		}
		else
		{
			if (aSiteList[0].length > 0)
			{
				aSiteList.push(sHost);
			}
			else
			{
				aSiteList[0] = sHost;
			}
			this.sSitelist = aSiteList.join(',');
		}

		this.objLinkifyPrefs.setCharPref('Linkify_SiteList', this.sSitelist);

		return true;
	},

	GetWindows: function(ndWindow)
	{
		if (ndWindow == ndWindow.top)
		{
			this.aFrameWindows = Array();
			this.aFrameWindows.push(ndWindow);
		}

		for (var ctr = 0; ctr < ndWindow.frames.length; ++ctr)
		{
			this.aFrameWindows.push(ndWindow.frames[ctr]);

			if (ndWindow.frames[ctr].frames.length > 0)
			{
				this.GetWindows(ndWindow.frames[ctr]);
			}
		}

		return true;
	},

	FindFrame: function(ndWindow, ndDocument)
	{
		this.GetWindows(ndWindow);
		for (var ctr = 0; ctr < this.aFrameWindows.length; ++ctr)
		{
			if (this.aFrameWindows[ctr].document == ndDocument)
			{
				return this.aFrameWindows[ctr];
			}
		}

		return false;
	},

	DoubleClickLink: function(objSelection)
	{
		var sPreText = this.WholeTextBefore(objSelection.anchorNode);
		var sPostText = this.WholeTextAfter(objSelection.anchorNode);

		var nLeftBound = sPreText.length + objSelection.anchorOffset;
		var nRightBound = nLeftBound + objSelection.toString().length;

		var sCompleteText = sPreText + objSelection.anchorNode.nodeValue + sPostText;

		for (var aMatch = null; ((aMatch = this.sRegExpAll.exec(sCompleteText)) && (nRightBound > aMatch.index));)
		{
			if (nLeftBound <= (aMatch.index + aMatch[0].length))
			{
				sHREF = this.GetLinkHREF(aMatch);
				return this.ClickLink(sHREF, 0);
			}

			nLeftBound -= (aMatch.index + aMatch[0].length);
			nRightBound -= (aMatch.index + aMatch[0].length);
			sCompleteText = sCompleteText.substr((aMatch.index + aMatch[0].length));
		}

		return true;
	},

	WholeTextBefore: function(ndNode)
	{
		if (ndNode.nodeName != '#text')
		{
			return false;
		}

		var ndDocument = this.GetParent(ndNode, '#document');
		var sQuery, objResult;

		var nOffset = 0;
		var ndTraverseNode = ndNode;
		var ndBlockLevelNode = false;
		while (!ndBlockLevelNode)
		{
			if (!ndTraverseNode.previousSibling)
			{
				ndTraverseNode = ndTraverseNode.parentNode;
				if (!this.aInlineHash[ndTraverseNode.nodeName.toLowerCase()])
				{
					ndBlockLevelNode = ndTraverseNode;
					nOffset = 0;
				}
			}
			else
			{
				ndTraverseNode = ndTraverseNode.previousSibling;

				try
				{
					ndTraverseNode.setAttribute('linkification-marker', '');
					sQuery = '//node()[ancestor-or-self::*[@linkification-marker] and not(self::text() or self::comment() or self::' + this.aInlineElements.join(' or self::') + ')]';
					objResult = this.XPathQuery(sQuery, ndDocument);
					ndTraverseNode.removeAttribute('linkification-marker');

					if (objResult.snapshotLength > 0)
					{
						ndBlockLevelNode = objResult.snapshotItem(objResult.snapshotLength - 1);
						nOffset = ndBlockLevelNode.childNodes.length;
					}
				}
				catch (sError)
				{
				}
			}
		}

		var objRange = document.createRange();
		objRange.setEnd(ndNode, 0);
		objRange.setStart(ndBlockLevelNode, nOffset);

		var sText = objRange.toString();
		objRange.detach();
		return sText;
	},

	WholeTextAfter: function(ndNode)
	{
		if (ndNode.nodeName != '#text')
		{
			return false;
		}

		var ndDocument = this.GetParent(ndNode, '#document');
		var sQuery, objResult;

		var nOffset = 0;
		var ndTraverseNode = ndNode;
		var ndBlockLevelNode = false;
		while (!ndBlockLevelNode)
		{
			if (!ndTraverseNode.nextSibling)
			{
				ndTraverseNode = ndTraverseNode.parentNode;
				if (!this.aInlineHash[ndTraverseNode.nodeName.toLowerCase()])
				{
					ndBlockLevelNode = ndTraverseNode;
					nOffset = ndBlockLevelNode.childNodes.length;
				}
			}
			else
			{
				ndTraverseNode = ndTraverseNode.nextSibling;

				try
				{
					ndTraverseNode.setAttribute('linkification-marker', '');
					sQuery = '//node()[ancestor-or-self::*[@linkification-marker] and not(self::text() or self::comment() or self::' + this.aInlineElements.join(' or self::') + ')]';
					objResult = this.XPathQuery(sQuery, ndDocument);
					ndTraverseNode.removeAttribute('linkification-marker');

					if (objResult.snapshotLength > 0)
					{
						ndBlockLevelNode = objResult.snapshotItem(0);
						nOffset = 0;
					}
				}
				catch (sError)
				{
				}
			}
		}

		var objRange = document.createRange();
		objRange.setEnd(ndBlockLevelNode, nOffset);
		objRange.setStart(ndNode, ndNode.length);

		var sText = objRange.toString();
		objRange.detach();
		return sText;
	},

	WholeText: function(ndNode)
	{
		return (ndNode.nodeName == '#text') ? (this.WholeTextBefore(ndNode) + ndNode.nodeValue + this.WholeTextAfter(ndNode)) : false;
	},

	GetElementsByAttributes: function(ndDocument, aAttributes)
	{
		var sAttributeName;

		var sQuery = '';
		for (sAttributeName in aAttributes)
		{
			sQuery += '(//node()[@' + sAttributeName;
			sQuery += (aAttributes[sAttributeName].length > 0) ? "='" + aAttributes[sAttributeName] + "'" : '';
			sQuery += ']) or ';
		}
		sQuery = sQuery.substring(0, sQuery.length - 4);
		var objResult = this.XPathQuery(sQuery, ndDocument);

		var aNodes = Array();
		for (var ctr = 0; ctr < objResult.snapshotLength; ++ctr)
		{
			aNodes.push(objResult.snapshotItem(ctr));
		}

		return aNodes;
	},

	XPathQuery: function(sQuery, ndDocument)
	{
		var ndOwnerDocument = (ndDocument.ownerDocument == null) ? ndDocument.documentElement : ndDocument.ownerDocument.documentElement;
		if (ndOwnerDocument.namespaceURI) sQuery = sQuery.replace('ancestor::', 'ancestor::xhtml:');

		var objXPE = new XPathEvaluator();
		var objNSResolver = function(prefix) { return 'http://www.w3.org/1999/xhtml'; };
		var objResult = objXPE.evaluate(sQuery, ndDocument, objNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		delete objXPE;
		objXPE = null;

		return objResult;
	},

	GetHost: function(ndDocument)
	{
		var sHost;
		if (!ndDocument)
		{
			var objURI = gBrowser.webNavigation.currentURI;
			try
			{
				sHost = objURI.host;
			}
			catch(sError)
			{
				return false;
			}
		}
		else
		{
			sHost = ndDocument.location.href;
			var nProtocol = sHost.indexOf('://');
			if (nProtocol == -1)
			{
				return false;
			}

			sHost = sHost.substr(nProtocol + 3);

			var nSlash = sHost.indexOf('/');
			sHost = (nSlash == -1) ? sHost : sHost.substr(0, nSlash);
		}

		return sHost;
	},

	GetSiteListed: function(sHost)
	{
		var aSiteList = this.sSitelist.split(',');

		if (!sHost)
		{
			return false;
		}

		for (var ctr = 0; ctr < aSiteList.length; ++ctr)
		{
			if (sHost.lastIndexOf(aSiteList[ctr]) > -1)
			{
				return aSiteList[ctr];
			}
		}

		return false;
	},

	StatusBarClicked: function(e)
	{
		if (e.button != 0)
		{
			return true;
		}

		this.UserLinkify();

		return true;
	},

	IsExcluded: function(ndDocument, ndNode)
	{
		if (ndNode.nodeName == '#text')
		{
			ndNode = ndNode.parentNode;
		}

		if (ndNode.setAttribute)
		{
			ndNode.setAttribute('linkification-marker', '');
			var sQuery = '//node()[self::*[@linkification-marker] and (self::' + this.aExcludeElements.join(' or self::') + ')]';
			var objResult = this.XPathQuery(sQuery, ndDocument);
			ndNode.removeAttribute('linkification-marker');

			return (objResult.snapshotLength > 0);
		}

		return false;
	},

	GetParent: function(ndNode, sNodeName)
	{
		sNodeName = sNodeName.toLowerCase();
		while (ndNode.nodeName.toLowerCase() != '#document')
		{
			if (ndNode.nodeName.toLowerCase() == sNodeName)
			{
				return ndNode;
			}

			ndNode = ndNode.parentNode;
		}

		return (sNodeName == '#document') ? ndNode : false;
	},

	ObjectDebug: function(objItem)
	{
		var sAlert = '';
		for (var nIndex in objItem)
		{
			sAlert += nIndex + ': ' + objItem[nIndex] + '(' + typeof(objItem[nIndex]) + ')' + '\n';
		}

		alert(sAlert);
		return true;
	},

	Options: function()
	{
		window.openDialog('chrome://linkification/content/linkificationOptions.xul', 'linkificationOptions', 'centerscreen,chrome,modal');

		return true;
	}
};

window.addEventListener('load', objLinkify.InitServices, false);
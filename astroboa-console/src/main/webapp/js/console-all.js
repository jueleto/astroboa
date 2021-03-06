// this variable holds the current user locale
var locale

// keep all object property descriptions in a map (js object actually) in order to minimize server traffic
var objectPropertyDescriptionMap = {};

//keep all topic property help messages in a map (js object actually) in order to minimize server traffic
var topicPropertyHelpMessageMap = {};

//keep help messages for all Object Reference Properties in a map (js object actually) in order to minimize server traffic
var objectRefPropertyHelpMessageMap = {};

// here we copy the label of the currently edited taxonomy or topic (through the context menus) so 
// that we can add the label to the tab when the ajax call returns
var labelOfCurrentlyDisplayedTaxonomyOrTopicTab;

// These two variables will hold the context menus for taxonomy an topics shown on the Taxonomy navigation tree
var topicContextMenu;
var taxonomyContextMenu;

// this variable holds whether context menus for taxonomy and topics should be created
// i.e. whether the logged in user has role taxonomy_editor
// it is set when the main page template loads (consoleLayout.xhtml) through a facelets expression 
var shouldCreateTaxonomyAndTopicContextMenus = false;

// this variable holds the code editor object
var editor;

// create references to remote services
var editServiceAsync = Seam.Component.getInstance("editServiceAsync");
//var schemaServiceAsync = Seam.Component.getInstance("schemaServiceAsync");
var sessionChecker = Seam.Component.getInstance("httpSessionChecker");



// create the code editor dialog
function createCodeEditor() {
	
	bcmslib.jQuery('#codeEditorDialog').dialog(
		{ 
			autoOpen: false,
			modal: true,
			width: 700,
			height: 500,
			resizable: false,
			draggable: false
		 }
	);
}

function openCodeEditorDialog() {

	var codeEditorWidth = bcmslib.jQuery(document).width() - 10;
	var codeEditorHeight = bcmslib.jQuery(document).height();
	bcmslib.jQuery('#codeEditorDialog').dialog( "option", "width", codeEditorWidth);
	bcmslib.jQuery('#codeEditorDialog').dialog( "option", "height", codeEditorHeight);
	bcmslib.jQuery('#codeEditorDialog').dialog('open');
}

// create a code editor object and show the code editor dialog box
function showCodeEditor(propertyFullPath) {
	//var textAreaSelector = "textarea[class='codeEditor_" + propertyFullPath.replace(/\./g, "\\\\.") + "']";
	var textAreaSelector = ".codeEditor_" + propertyFullPath.replace(/\./g, "\\.");
	var textAreaId=bcmslib.jQuery(textAreaSelector).attr("name");
	alert(document.getElementsByName(textAreaId)[0].value);
	editor = new CodeMirror(CodeMirror.replace("codeEditor"), {
		parserfile: "parsexml.js",
		path: "/console/js/CodeMirror-0.93/js/",
		stylesheet: "/console/css/xmlcolors.css",
		content: document.getElementsByName(textAreaId)[0].value
	});
	
	openCodeEditorDialog();
}

function toggleCodeEditorAreas() {
	if (codeEditorAreas.length >= 1) {
		jQuery.each(codeEditorAreas, function(index, value) {editAreaLoader.toggle(value);});
	}
}
	
var timeoutMillisContentObjectSave = 2*60*1000;
var autoSaveTimeoutInterval = null;

function startContentObjectAutoSave() {
	//Start auto save only if button exists
	if (document.getElementById('dynamicAreaForm:saveDraftContentObjectButton') != null)
	{
		autoSaveTimeoutInterval = setInterval(triggerSaveAsDraft, timeoutMillisContentObjectSave);
	}
}

function stopContentObjectAutoSave() {

	if (autoSaveTimeoutInterval) {
		clearInterval(autoSaveTimeoutInterval);
	}
}

function resetContentObjectAutoSave() {
	stopContentObjectAutoSave();
	startContentObjectAutoSave();
}

function triggerSaveAsDraft()
{
	// editAreaLoader.prepare_areas_for_betacms_submit("dynamicAreaForm");
	
	// we should first copy the active editor data in the form field
	if ( editor && textEditorArea) {
		bcmslib.jQuery(textEditorArea).val(editor.getData());
	}
	autoSaveContentObject();
}

function callFunctionOnEnterKey(e, func, arg) {
	var evt=(e)?e:(window.event)?window.event:null;
	if(evt){
		var key=(evt.charCode)?evt.charCode:((evt.keyCode)?evt.keyCode:((evt.which)?evt.which:0));
		// alert("key pressed" + key);
		if(key==13){
			func(arg);
		}
		else {return "not_an_enter";}

	}
}
    
    /* XSD Editor */
    function createXSDEditor() {
    	
    	bcmslib.jQuery('#XSDEditor').dialog(
			{ 
				autoOpen: false,
				modal: true,
				resizable: false,
				draggable: false,
				open: function(event, ui) 
					{
						var xsdEditorId=bcmslib.jQuery("textarea[class='XSDEditorTextArea']").attr('id');
						editAreaLoader.init({
							id : xsdEditorId,		// textarea id
							syntax: "xml",										// syntax to be used for highgliting
							start_highlight: true,		// to display with highlight mode on at start-up
							toolbar: "search, go_to_line, fullscreen, |, undo, redo, |, select_font, |, syntax_selection, |, change_smooth_selection, highlight, reset_highlight, word_wrap, |, help"
							
						});

					}
			 }
		);
    }
    
    function openXSDEditor() {

		var xsdEditorWidth = bcmslib.jQuery(document).width() - 10;
		var xsdEditorHeight = bcmslib.jQuery(document).height();
		bcmslib.jQuery('#XSDEditorForm\\:XSDEditorPanel').height(xsdEditorHeight - 100);
		bcmslib.jQuery('#XSDEditor').dialog( "option", "width", xsdEditorWidth);
		bcmslib.jQuery('#XSDEditor').dialog( "option", "height", xsdEditorHeight);
		bcmslib.jQuery('#XSDEditor').dialog('open');
	}
    
    
    /* Clipboard */
    function createClipboard() {
    	
    	bcmslib.jQuery('#clipboard').dialog(
			{ 
				autoOpen: false,
				modal: false,
				width: 700,
				height: 500,
				resizable: true,
				draggable: true
			 }
		);
    }
    
    function openClipboard() {
		bcmslib.jQuery('#clipboard').dialog('open');
	}
    
    /* file upload */
    function createfileUploadDialog() {
    	
    	bcmslib.jQuery('#fileUploadDialog').dialog(
			{ 
				autoOpen: false,
				modal: true,
				width: 450,
				resizable: true,
				draggable: false,
				open: function(event, ui) 
				{	
					bcmslib.jQuery(this).parent().children().children('.ui-dialog-titlebar-close').hide();
				}
			 }
		);
    }
    
    function openFileUploadDialog() {
		bcmslib.jQuery('#fileUploadDialog').dialog('open');
	}
    
    /* Deletion Confirmation */
    function createConfirmationDialog() {
    	
    	bcmslib.jQuery('#confirmationDialog').dialog(
			{ 
				autoOpen: false,
				modal: true,
				width: 550,
				resizable: true,
				draggable: false
			 }
		);
    }
    
    function openConfirmationDialog() {
		bcmslib.jQuery('#confirmationDialog').dialog('open');
	}
    
    function closeConfirmationDialog() {
		bcmslib.jQuery('#confirmationDialog').dialog('close');
	}
    
    function createDynamicConfirmationDialog() {
    	bcmslib.jQuery('#dynamicConfirmationDialog').dialog(
    			{ 
    				autoOpen: false,
    				modal: true,
    				width: 450,
    				resizable: true,
    				draggable: false
    			 }
    		);
    }
    
    function closeDynamicConfirmationDialog() {
    	bcmslib.jQuery('#dynamicConfirmationDialog').dialog('close');
    }
    
    /* Dynamically generated dialoque */
    function showDynamicConfirmationDialog(dialogHeader, dialogMessage, okLabel, cancelLabel, functionToRunIfOk, functionToRunIfCancel) {
    	var message = "<p>"+ dialogMessage + "</p>";
    	var okButton = "<a href='#' style='margin-right: 20px;' onclick='" + functionToRunIfOk +"'>" + okLabel + "</a>";
    	var cancelButton = "<a href='#' onclick='closeDynamicConfirmationDialog(); " + functionToRunIfCancel +"'>" + cancelLabel + "</a>";
    	var dialogMarkup = message + "<p style='text-align: center;'>" + okButton + cancelButton + "</p>";
    	
    	bcmslib.jQuery('#dynamicConfirmationDialog').attr("title", dialogHeader);
    	
    	bcmslib.jQuery('#dynamiConfirmationDialogForm').empty().append(dialogMarkup);
    	
    	bcmslib.jQuery('#dynamicConfirmationDialog').dialog('open');
    }
    
    /* Object Property URL Creation Dialogue */
    function createObjectPropertyUrlCreationDialog() {
    	
    	bcmslib.jQuery('#objectPropertyUrlCreationDialog').dialog(
			{ 
				autoOpen: false,
				modal: true,
				width: 550,
				resizable: true,
				draggable: false
			 }
		);
    }
    
    function openObjectPropertyUrlCreationDialog() {
		bcmslib.jQuery('#objectPropertyUrlCreationDialog').dialog('open');
	}
    
    /* Topic Selection Dialog */
    function createTopicSelectionDialog() {
    	
    	bcmslib.jQuery('#topicSelectionDialog').dialog(
			{ 
				autoOpen: false,
				modal: false,
				width: 300,
				height: 450,
				resizable: true,
				draggable: true,
				position: ['right','top'],
				open: function(event, ui) 
				{	
					bcmslib.jQuery(this).parent().children().children('.ui-dialog-titlebar-close').hide();
				}
			 }
		);
    }
    
    function openTopicSelectionDialog() {
		bcmslib.jQuery('#topicSelectionDialog').dialog('open');
	}
    
    function closeTopicSelectionDialog() {
		bcmslib.jQuery('#topicSelectionDialog').dialog('close');
	}
    
    
    /* Object Selection Dialog */
    function createObjectSelectionDialog() {
    	
    	bcmslib.jQuery('#objectSelectionDialog').dialog(
			{ 
				autoOpen: false,
				modal: false,
				width: 700,
				height: 580,
				resizable: true,
				draggable: true,
				position: ['center', 'top'],
				open: function(event, ui) 
				{	
					bcmslib.jQuery(this).parent().children().children('.ui-dialog-titlebar-close').hide();
				}
			 }
		);
    }
    
    function openObjectSelectionDialog() {
		bcmslib.jQuery('#objectSelectionDialog').dialog('open');
	}
    
    function closeObjectSelectionDialog() {
		bcmslib.jQuery('#objectSelectionDialog').dialog('close');
		bcmslib.jQuery("#objectSelectionDialogResults").html("");
		bcmslib.jQuery("#objectSelectionDialogMessages").html("");
	}
    
    
    /* Property Prototype Selection Dialog */
    function createPropertyPrototypeSelectionDialog() {
    	
    	bcmslib.jQuery('#propertyPrototypeSelectionDialog').dialog(
			{ 
				autoOpen: false,
				modal: false,
				width: 500,
				height: 500,
				resizable: true,
				draggable: true,
				position: ['center', 95]
			 }
		);
    }
    
    function openPropertyPrototypeSelectionDialog() {
		bcmslib.jQuery('#propertyPrototypeSelectionDialog').dialog('open');
	}
    
    function closePropertyPrototypeSelectionDialog() {
		bcmslib.jQuery('#propertyPrototypeSelectionDialog').dialog('close');
	}
    
    
    /* Create Import Taxonomy from Xml Dialog */
    function createImportTaxonomyXmlDialog() {
    	bcmslib.jQuery('#taxonomyImportDialog').dialog(
    			{ 
    				autoOpen: false,
    				modal: true,
    				width: 450,
    				resizable: true,
    				draggable: false,
    				open: function(event, ui) 
    				{	
    					bcmslib.jQuery(this).parent().children().children('.ui-dialog-titlebar-close').hide();
    				}
    			 }
    		);
    }
    
    function openImportTaxonomyXmlDialog() {
    	bcmslib.jQuery('#taxonomyImportDialog').dialog('open');
    }
    
    function closeImportTaxonomyXmlDialog() {
    	bcmslib.jQuery('#taxonomyImportDialog').dialog('close');
    }
    
    
    
    /* functions that create object and object property URLs */
    function generateObjectPropertyUrl(friendlyUrlSelected) {
    	var selectedDispositionType = bcmslib.jQuery('input[name=dispositionType]:checked').val();
    	var selectedImageWidth = bcmslib.jQuery('#objectPropertyUrlCreationDialogImageWidth').length > 0 ? bcmslib.jQuery('#objectPropertyUrlCreationDialogImageWidth').val() : -1;
    	var selectedImageHeight = bcmslib.jQuery('#objectPropertyUrlCreationDialogImageHeight').length > 0 ? bcmslib.jQuery('#objectPropertyUrlCreationDialogImageHeight').val() : -1;
    	var selectedAspectRatio = bcmslib.jQuery('#objectPropertyUrlCreationDialogImageAspectRatio').length > 0 ? bcmslib.jQuery('#objectPropertyUrlCreationDialogImageAspectRatio').val() : -1;
    	var selectedCropPolicy = bcmslib.jQuery('input[name=cropPolicy]:checked').val();
    	
    	generateObjectPropertyUrlAndCopyToClipboard(
    			selectedDispositionType,
    			selectedImageWidth,
    			selectedImageHeight,
    			selectedAspectRatio,
    			selectedCropPolicy,
    			friendlyUrlSelected); 
	    			
    }
    
    
    /* TOP MENU */
    function createTopMenu() {
    	
    	bcmslib.jQuery(".betaCMSMenu").buildMenu(
  		      {
  		        template:"",
  		        additionalData:"",
  		        menuWidth:200,
  		        openOnRight:false,
  		        menuSelector: ".menuContainer",
  		        iconPath:"images/topMenu/ico/",
  		        hasImages:true,
  		        fadeInTime:100,
  		        fadeOutTime:300,
  		        adjustLeft:2,
  		   //     minZindex:"auto",
  		        minZindex:10,
  		        adjustTop:10,
  		        opacity:.95,
  		        shadow:false,
  		        shadowColor:"#ccc",
  		        hoverIntent:0,
  		        openOnClick:true,
  		        closeOnMouseOut:true,
  		        closeAfter:300,
  		        submenuHoverIntent:0
  		      });
    	
    	
    }
    
    /* TABS */
    function initTabs() {
    	bcmslib.jQuery("#tabs").tabs(
    			{ 	//fx: 	{ opacity: 'toggle' },
    				//event: "mouseover",
    				select: function(event, ui) {
    					if (ui.index == 1) { //user space tab selected
    						reRenderFolder();
    					}
    					//else if (ui.index == 0) { // dashboard panel selected
    					//	refreshLoggedInUserRecentlyAddedOrModifiedContent();
    					//	refreshRecentlyAddedOrModifiedContent();
    					//	refreshRecentlyAddedOrModifiedPublishedContent();
    					//	refreshContentObjectsSubmittedForWebPublishing();
    					//	refreshContentObjectsSubmittedByExternalUserForWebPublishing();
    					//	refreshContentObjectsTemporarilyRejectedForReauthoring();
    					//}
    				}

				}
		);
    	
    	// Show only the dashboard and personal workspace tab
    	bcmslib.jQuery("#dynamicTabSelector").css("display","none");
    	bcmslib.jQuery("#objectViewerTabSelector").css("display","none");
    	bcmslib.jQuery("#objectEditorTabSelector").css("display","none");
    	bcmslib.jQuery("#searchResultsTabSelector").css("display","none");
    	showTab("dashboardTab");
    	
    	
    	// show the tabs div
    	bcmslib.jQuery("#tabs").css("display","block");
    	
    }
    
    // "unhides" if necessary and then selects the named tab
    // it is not used for dynamicTab 
    // For dynamicTab we need to change the label and another function (showDynamicTab) is used
    function showTab(tab) {
    	
    	var activeTabId;
    	switch (tab) {
    	case 'dashboardTab':
    		activeTabId = 0;
			break;
    	case 'personalWorkSpaceTab':
    		activeTabId = 1;
			break;
    	case 'searchResultsTab':
    		activeTabId = 2;
			break;
    	case 'objectEditorTab':
    		activeTabId = 3;
			break;
    	case 'objectViewerTab':
    		activeTabId = 4;
			break;
		default:
			activeTabId = 0;
			break;
		}
    	
    	bcmslib.jQuery("#"+tab+"Selector").css("display","list-item");
    	bcmslib.jQuery( "#tabs" ).tabs( "option", "selected", activeTabId );
    }
    
    function showDynamicTab(tabLabel) {
    	bcmslib.jQuery('#tabs ul li:nth-child(6) a').html(tabLabel);
    	bcmslib.jQuery("#dynamicTabSelector").css("display","list-item");
    	bcmslib.jQuery( "#tabs" ).tabs( "option", "selected", 5 );
    }
    
    function hideTab(tab) {
    	// first select the dashboard tab (0 index) which is always visible
    	bcmslib.jQuery( "#tabs" ).tabs( "option", "selected", 0);
    	
    	bcmslib.jQuery("#"+tab+"Selector").css("display","none");
    }
    
    function hideAllTabs() {
    	bcmslib.jQuery("#tabSelectors").children().css("display","none");
    }
    
    
    function createObjectTabs() {
    	bcmslib.jQuery("#objectTabs").tabs(
    			{ 	//fx: 	{ opacity: 'toggle' },
    				//event: "mouseover",
    				//select: function(event, ui) {
    				//	if (ui.index == 1) { //user space tab selected
    				//		reRenderFolder();
    				//	}
    					//else if (ui.index == 0) { // dashboard panel selected
    					//	refreshLoggedInUserRecentlyAddedOrModifiedContent();
    					//	refreshRecentlyAddedOrModifiedContent();
    					//	refreshRecentlyAddedOrModifiedPublishedContent();
    					//	refreshContentObjectsSubmittedForWebPublishing();
    					//	refreshContentObjectsSubmittedByExternalUserForWebPublishing();
    					//	refreshContentObjectsTemporarilyRejectedForReauthoring();
    					//}
    				//}

				}
		);
    		
    	// show the tabs div
    //	bcmslib.jQuery("#objectTabs").tabs().addClass('ui-tabs-vertical ui-helper-clearfix');
    //	bcmslib.jQuery("#objectTabs li").removeClass('ui-corner-top').addClass('ui-corner-left');
    	bcmslib.jQuery("#objectTabs").css("display","block");
    	
    	// if an existing object is loaded them show the object properties tab and not the profile tab 
    	var objectId = bcmslib.jQuery("#objectId span").text();
    	if (objectId) {
    		bcmslib.jQuery( "#objectTabs" ).tabs( "option", "selected", 1);
    	}
    }
    
    // SET BUTTON IN SCRIPT ENGINE CONSOLE TO TOGGLE DIV TO FULLSCREEN
    function toggleScriptEngineConsoleFullscreen(elementToResizeId, parentElementId) {
		if (bcmslib.jQuery("#"+elementToResizeId).hasClass("scriptEngineConsoleFullscreen")) {
			bcmslib.jQuery("#"+elementToResizeId).appendTo(bcmslib.jQuery("#"+parentElementId)).removeClass("scriptEngineConsoleFullscreen").addClass("scriptEngineConsole");
		}
		else {
			bcmslib.jQuery("#"+elementToResizeId).appendTo(bcmslib.jQuery("body")).removeClass("scriptEngineConsole").addClass("scriptEngineConsoleFullscreen");
		}
    }
    
    // ACTIVATE HOT KEYS. CURRENTLY ctrl+s for saving
    function activateHotKeys() {
    	bcmslib.jQuery(document).bind('keydown', 'ctrl+s',
    			function (){
    				if (bcmslib.jQuery('#tabs').tabs('option', 'selected') == 2)  {// 2 is objectEditorTab
    					editAreaLoader.prepare_areas_for_betacms_submit('dynamicAreaForm');
    					saveContentObject();
    				}
    				else {alert("Nothing Saved. The shortcut for saving an object works only if the editor tab is active");}
    			}
    	);
    }
    
    function activateSaveHotKeyInsideEditors() {
    	// bcmslib.jQuery("textarea[class*='saveHotKeyAllowed']").length > 0 ? alert("nato") : alert("pounto???");
    	bcmslib.jQuery("textarea[class*='saveHotKeyAllowed']").bind('keydown', 'ctrl+s',
    			function (){
    				editAreaLoader.prepare_areas_for_betacms_submit('dynamicAreaForm');
    				saveContentObject();
    			}
    	);
    }
    
    
    /* Selection Checkboxes in Result Table */
    var tableMany;
    var selectAllIsCheckedByUser = false;
    
    function initializeTableSelect() {
    	hideBulkActionsOnSelected();
    	tableMany = null;
	    tableMany = bcmslib.jQuery(".resultsTableSelectable").tableSelectMany({
	    	listeners : {
	                beforerowselect   : function(event) {
	                    this.preventChange = (this.target === "a") ? true : false;
	                },
	                beforerowdeselect : function(event) {
	                    this.preventChange = (this.target === "a") ? true : false;
	                },
	                afterrowselect    : function(event) {
	                    if (!selectAllIsCheckedByUser) {
	                    	addSelectedObject(this.rowIndex - 1);
	                    	showBulkActionsOnSelected();
	                    }
	                    
	                	if(this.parentThis.allSelected()) {
	                    	bcmslib.jQuery("input#tableManyCbAll").attr('checked', 'checked');
	                    }
	                    var toggle = bcmslib.jQuery(this).find('input');
	                    if(toggle.not(":checked")) toggle.attr('checked', 'checked');
	                },
	                afterrowdeselect  : function(event) {
	                	if (!selectAllIsCheckedByUser) {
	                		removeDeselectedObject(this.rowIndex - 1);
	                		if (this.parentThis.getSelections().length == 0) {
	                			hideBulkActionsOnSelected();
	                		}
	                    }
	                	
	                    if(!this.parentThis.allSelected()) bcmslib.jQuery("input#tableManyCbAll").removeAttr('checked');
	                    var toggle = bcmslib.jQuery(this).find('input');
	                    if(toggle.is(":checked")) toggle.removeAttr('checked');
	                }
	            }
	        });
    
	    bcmslib.jQuery(".resultsTableSelectable input").each(function() { this.checked = null; });
	    
	    // Select/Deselect all rows
	    bcmslib.jQuery("input#tableManyCbAll").bind("click", function() {
	        this.checked ? addAllRows() : removeAllRows();
	    });
    }
    
    function addAllRows() {
    	selectAllIsCheckedByUser = true;
    	tableMany.selectAll(); 
    	addAllObjectsOfCurrentPage();
    	showBulkActionsOnSelected();
    	selectAllIsCheckedByUser = false;
    }
    
    function removeAllRows() {
    	selectAllIsCheckedByUser = true;
    	tableMany.clearSelections(); 
    	removeAllObjectsOfCurrentPage();
    	hideBulkActionsOnSelected();
    	selectAllIsCheckedByUser = false;
    }
    
    function showBulkActionsOnSelected() {
    	bcmslib.jQuery('.bulkActionOnselected').show();
    }
    
    function hideBulkActionsOnSelected() {
    	bcmslib.jQuery('.bulkActionOnselected').hide();
    }
    
    /* create layout */
    var betacmsConsoleLayout;
    function createLayout() {

		betacmsConsoleLayout = bcmslib.jQuery("body").layout({
		
			west__paneSelector:			"#navigationMenuArea"
		,	center__paneSelector:		"#dynamicArea"
		,	north__paneSelector:		"#headerAnTopMenuArea"
		,	south__paneSelector:		"#footerArea"

		//	findNestedContent:				true
		//,	center__findNestedContent:		true

		//	enable showOverflow on west-pane so CSS popups will overlap north pane
		//	west__showOverflowOnHover: true

		,	closable:					false	// pane can open & close
		,	resizable:					false	// when open, pane can be resized 
		,	slidable:					false	// when closed, pane can 'slide' open over other panes - closes on mouse-out
		,	enableCursorHotkey: true
		
		//,	north__togglerLength_closed: '100%'	// toggle-button is full-width of resizer-bar
		,	west__size:					"auto"
		,	west__minSize:				250
		,	west__maxSize:				Math.floor(screen.availWidth / 2)
		,	west__spacing_open:			16
		,	west__spacing_closed:		16
		,	west__closable:				true
		,	west__resizable:			true
		,	west__slidable:				true
		,	west__initClosed:			true
		,	west__fxName:				"none"
		,	west__fxSpeed:				"normal"
		,	west__fxSettings:			{ easing: "" } //reset default easing
		
		,	north__spacing_open:		10
		,	north__spacing_closed:		10
		
		,	south__spacing_open:		10
		,	south__spacing_closed:		10
		
		,	togglerContent_open:	'<div class="ui-icon ui-icon-circle-triangle-w"></div>'
		,	togglerContent_closed:	'<div class="ui-icon ui-icon-circle-triangle-e"></div>'
		
		});

		// add event to the 'Close' button in the East pane dynamically...
		//betacmsConsoleLayout.addCloseBtn('#btnCloseEast', 'west');

		// add event to the 'Toggle South' buttons in Center AND South panes dynamically...
		//betacmsConsoleLayout.addToggleBtn('.south-toggler', 'south');

		// add MULTIPLE events to the 'Open All Panes' button in the Center pane dynamically...
		//betacmsConsoleLayout.addOpenBtn('#openAllPanes', 'north');
		//betacmsConsoleLayout.addOpenBtn('#openAllPanes', 'south');
		//betacmsConsoleLayout.addOpenBtn('#openAllPanes', 'west');
		//betacmsConsoleLayout.addOpenBtn('#openAllPanes', 'east');
 	}
    
    /* set the ajax request status indicator in the middle of the screen */
    function positionAjaxLoaderOnScreenCenter() {
    	var loaderImageWidth = 128;
    	var loaderImageHeight = 128;
    	var document_height = bcmslib.jQuery(document).height(); 
		var window_width 	= bcmslib.jQuery(window).width();
		var window_height 	= bcmslib.jQuery(window).height() ;
		var left  =  	Math.round((window_width / 2)- loaderImageWidth); 
		var top   = 	Math.round((window_height / 2)- loaderImageHeight) + bcmslib.jQuery(document).scrollTop();
		
    	bcmslib.jQuery("#_viewRoot\\:status\\.start").css({
    		'position':'absolute',
    		'top':top+'px',
    		'left':left+'px',
    		'z-index':2000});
    	
    	bcmslib.jQuery("#draftstatus").css({
    		'position':'absolute',
    		'top':top+'px',
    		'left':left+'px',
    		'z-index':2000});
    } 
    
    
    
    
    /* GENERATE HELP MESSAGES FOR PROPERTIES */
    function addHelpMessageToProperties() {
    	bcmslib.jQuery('.propertyTip').tipsy(
    			{
    				trigger: 'manual',
    				html: true, 
    				gravity: bcmslib.jQuery.fn.tipsy.autoWE, 
    				fallback: "No description available", 
    				title: function() { 
    									var fullPropertyPath =  bcmslib.jQuery(this).attr('id').replace(/-.*/,"").replace(/\[.*\]/,"");
    									return objectPropertyDescriptionMap[fullPropertyPath];
    								} 
    			});
    	
    	bcmslib.jQuery(document)
    		.delegate('.propertyTip', 'click', function() {
    								var tipsy = bcmslib.jQuery.data(this, 'tipsy');
									bcmslib.jQuery.when(getPropertyDescription(this)).then(function(){
										tipsy.show();
									});
								} 
    		);
    	
    	bcmslib.jQuery(document)
		.delegate('.propertyTip', 'mouseleave', function() { 
								var tipsy = bcmslib.jQuery.data(this, 'tipsy');
								bcmslib.jQuery.when(getPropertyDescription(this)).then(function(){
									tipsy.hide();
								});
							} 
		);
    }
    
    function getPropertyDescription(propertyElement) {
    	// We will return a promise and pass the deferred object to the success event so that the subscriber will be able to resolve it when the query data has been processed 
		var dfd = bcmslib.jQuery.Deferred();
    	
    	var fullPropertyPath =  bcmslib.jQuery(propertyElement).attr('id').replace(/-.*/,"");

    	if (objectPropertyDescriptionMap[fullPropertyPath] != null) {
    		dfd.resolve();
    	}
    	else {
    		//schemaServiceAsync.getPropertyDescription(fullPropertyPath, returnPropertyDescription);
    		getObjectModel(fullPropertyPath, 'objectForm.getPropertyModel.success', null, {'fullPropertyPath' : fullPropertyPath, 'dfd': dfd});
    	}
    	
    	return dfd.promise();
    }
    
    amplify.subscribe('objectForm.getPropertyModel.success', function( settings, data, status, eventContext ) {
		if (data != null) {
			var localizedPropertyDescription = data.description[locale];
			if (localizedPropertyDescription == null) {
				localizedPropertyDescription = data.description['en'];
				if (localizedPropertyDescription == null) {
					localizedPropertyDescription = 'There is no localized description';
				}
			}
			
			var fullPropertyPath = eventContext['fullPropertyPath'];
			var description = '<div style="width: 500px;">' + labelForInternalPropertyName + " <strong>" + fullPropertyPath + "</strong><hr /><br/>" + localizedPropertyDescription + '</div>';
			objectPropertyDescriptionMap[fullPropertyPath] = description;
			var dfd = eventContext['dfd'];
			dfd.resolve();
		}
	});
    
    
    
    
    /* TOP MENU */
    function createObjectTypeSelectionMenuInFolderTab() {
    	
    	bcmslib.jQuery(".objectTypeSelectionMenu").buildMenu(
  		      {
  		        template:"",
  		        additionalData:"",
  		        menuWidth:520,
  		        openOnRight:false,
  		        menuSelector: ".menuContainer",
  		        iconPath:"images/topMenu/ico/",
  		        hasImages:true,
  		        fadeInTime:100,
  		        fadeOutTime:300,
  		        adjustLeft:2,
  		        //minZindex:"auto",
  		        minZindex:10,
  		        adjustTop:10,
  		        opacity:.85,
  		        shadow:false,
  		        shadowColor:"#ccc",
  		        hoverIntent:0,
  		        openOnClick:true,
  		        closeOnMouseOut:true,
  		        closeAfter:700,
  		        submenuHoverIntent:0
  		      });
    	
    	
    }
    
    
    // SPLIT <ul> or <ol> LISTs IN COLUMNS, use 'horizontal' or 'vertical' as direction to split the list vertically or horizontally //
    function splitListInColumns(listClass, numOfCols, direction) {
    	bcmslib.jQuery("." + listClass).easyListSplitter({ 
    		   colNumber: numOfCols, 
    		   direction: direction 
    		});
    }
    
    /* Context Menu on Taxonomy and Topics */
    function createContextMenus() {
    	if (!shouldCreateTaxonomyAndTopicContextMenus) {
    		return;
    	}
    	
		bcmslib.jQuery('.topic').contextMenu(topicContextMenu);
		bcmslib.jQuery('.taxonomy').contextMenu(taxonomyContextMenu);
	}
    
    
    /* Ajax Activity Indicator*/
    function createAjaxActivityIndicator() {
    	
    	bcmslib.jQuery(document).ajaxStart(function() {	
    		bcmslib.jQuery("#ajaxActivityIndicator").hide();
    		bcmslib.jQuery("#ajaxActivityIndicator").show();
    	});
    	
    	bcmslib.jQuery(document).ajaxStop(function() {
    		bcmslib.jQuery("#ajaxActivityIndicator").hide();
    	});
    }
    
    
    /* use fancy box to present embedded resources */
    function showEmbeddedResource() {
    	var embeddedCode = bcmslib.jQuery(".embeddedResource").val();
    	bcmslib.jQuery.fancybox({
    		content: embeddedCode
    	});
    }
    
    function createSlideshow(classSelector) {
    	bcmslib.jQuery(classSelector).fancybox({
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
			'speedIn'		:	600, 
			'speedOut'		:	200, 
			'overlayShow'	:	false,
			'type'			:	'image'
		});
    }
    
    
    
    /* Create Portlets */
    function createDashBoardPortlets() {
    	bcmslib.jQuery(".portletColumn").sortable({
    		connectWith: '.portletColumn'
    	});

    	bcmslib.jQuery(".portlet-content").hide();

    	bcmslib.jQuery(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
    	.find(".portlet-header")
    	.addClass("ui-widget-header ui-corner-all")
    	.prepend('<span class="ui-icon ui-icon-plus"></span><span class="ui-icon ui-icon-refresh"></span>')
    	.end()
    	.find(".portlet-content");

    	bcmslib.jQuery(".portlet-header .ui-icon-plus").click(function(event) {
    		event.stopPropagation();
    		bcmslib.jQuery(this).toggleClass("ui-icon-minus");
    		bcmslib.jQuery(this).parents(".portlet:first").find(".portlet-content").toggle("slow");
    	});

    	bcmslib.jQuery(".portlet-header").click(function() {
    		bcmslib.jQuery(this).toggleClass("ui-icon-minus");
    		bcmslib.jQuery(this).parents(".portlet:first").find(".portlet-content").toggle("slow");
    	});
    	
    	bcmslib.jQuery(".loggedInUserRecentlyAddedOrModifiedContent .portlet-header .ui-icon-refresh").click(function() {
    		refreshLoggedInUserRecentlyAddedOrModifiedContent();
    	});

    	bcmslib.jQuery(".recentlyAddedOrModifiedContent .portlet-header .ui-icon-refresh").click(function() {
    		refreshRecentlyAddedOrModifiedContent();
    	});

    	bcmslib.jQuery(".recentlyAddedOrModifiedPublishedContent .portlet-header .ui-icon-refresh").click(function() {
    		refreshRecentlyAddedOrModifiedPublishedContent();
    	});

    	bcmslib.jQuery(".mostReadPublishedContentObjects .portlet-header .ui-icon-refresh").click(function() {
    		refreshMostReadPublishedContentObjects();
    	});

    	bcmslib.jQuery(".contentObjectsSubmittedForWebPublishing .portlet-header .ui-icon-refresh").click(function() {
    		refreshContentObjectsSubmittedForWebPublishing();
    	});

    	bcmslib.jQuery(".contentObjectsSubmittedByExternalUserForWebPublishing .portlet-header .ui-icon-refresh").click(function() {
    		refreshContentObjectsSubmittedByExternalUserForWebPublishing();
    	});

    	bcmslib.jQuery(".contentObjectsTemporarilyRejectedForReauthoring .portlet-header .ui-icon-refresh").click(function() {
    		refreshContentObjectsTemporarilyRejectedForReauthoring();
    	});

    	bcmslib.jQuery(".portletColumn").disableSelection();
    }
    
    /* CKEDITOR */
    var textEditorArea;
    var textEditorCloseButton;
    var textEditorOpenButton;
    var editor;
    
    function resetEditors() {
    	textEditorArea = null;
        textEditorCloseButton = null;
        textEditorOpenButton =null;
        if (editor) {
        	editor.destroy();
        	editor = null;
        }
    }
    
    /*
    // Open the editor in full page view by default
    CKEDITOR.on('instanceReady',
    	function( evt ) {
    		var editor = evt.editor;
    		editor.execCommand('maximize');
    });
    */
    
    /*
    function registerDoubleClickEventForOpeningTextEditor() {
    	if ( window.addEventListener )
    		document.body.addEventListener( 'dblclick', openTextEditorOnDoubleClick, false );
    	else if ( window.attachEvent )
    		document.body.attachEvent( 'ondblclick', openTextEditorOnDoubleClick );
    }
    
    function openTextEditorOnDoubleClick( ev )
    {
    	
    	// Get the element which fired the event. This is not necessarily the
    	// element to which the event has been attached.
    	var element = ev.target || ev.srcElement;

    	// Find out the parent element that holds this element.
    	// var parentElementIfTextFieldIsNotEmpty = element.parentNode; // a div element
    	var parentElementIfTextFieldIsNotEmpty = bcmslib.jQuery(element).parents(".editable").get(0);
    	var parentElementIfTextFieldIsEmpty = element.children[0]; // a div element

    	if ( parentElementIfTextFieldIsNotEmpty != null && parentElementIfTextFieldIsNotEmpty.nodeName.toLowerCase() == 'div'
    		 && ( parentElementIfTextFieldIsNotEmpty.className.indexOf( 'editable' ) != -1 ) ) {
    		
    		// first save the data of an existing text editor and then destoy the editor
    		destroyTextEditor();
    		
    		// Now we are ready to find the hidden form field for the currently double clicked text box
    		textEditorHiddenField = bcmslib.jQuery(parentElementIfTextFieldIsNotEmpty.parentNode).next();
    		
    		// find the new close and open buttons
    		textEditorOpenButton = bcmslib.jQuery(textEditorHiddenField).next();
    		textEditorCloseButton = bcmslib.jQuery(textEditorOpenButton).next();
    		replaceTextWithTextEditor( parentElementIfTextFieldIsNotEmpty );
    	}
    	else if (parentElementIfTextFieldIsEmpty != null && parentElementIfTextFieldIsEmpty.nodeName.toLowerCase() == 'div'
    		 && ( parentElementIfTextFieldIsEmpty.className.indexOf( 'editable' ) != -1 ) ) {
    		
    		// first save the data of an existing text editor and then destoy the editor
    		destroyTextEditor();
    		
    		// Now we are ready to find the hidden form field for the currently double clicked text box
    		textEditorHiddenField = bcmslib.jQuery(parentElementIfTextFieldIsEmpty.parentNode).next();
    		
    		// find the new close and open buttons
    		textEditorOpenButton = bcmslib.jQuery(textEditorHiddenField).next();
    		textEditorCloseButton = bcmslib.jQuery(textEditorOpenButton).next();
    		replaceTextWithTextEditor( parentElementIfTextFieldIsEmpty );
    	}
    }
    */
    
    function openTextEditor(openEditorButton) {
    	
    	// Find out the div that contains the editor
    	var editorDivParent = bcmslib.jQuery(openEditorButton).siblings(".editableParent");
    	var currentTextEditorArea = editorDivParent.children('.editable').get(0);

    	if ( currentTextEditorArea != null) {
    		
    		// first save the data of an existing text editor and then destoy the editora, hide its closeEditorButton and show its openEditorButton
    		destroyTextEditor();
    		
    		// Now we are ready to find the hidden form field for the currently edited text box as well as the buttons to open and close the editor
    		textEditorArea = currentTextEditorArea;
    		textEditorOpenButton = bcmslib.jQuery(editorDivParent).next();
    		textEditorCloseButton = bcmslib.jQuery(textEditorOpenButton).next();
    		
    		replaceTextWithTextEditor(textEditorArea);
    	}
    }
    
    

    function replaceTextWithTextEditor( textEditorArea )
    {
    	editor = CKEDITOR.replace( textEditorArea );
    	bcmslib.jQuery(textEditorOpenButton).hide();
    	bcmslib.jQuery(textEditorCloseButton).show();
    }
    
    // Save text editor data in relevant hidden form field and then destroy the text editor
    function destroyTextEditor() {
    	if ( editor && textEditorArea) {
    		bcmslib.jQuery(textEditorArea).val(editor.getData());
    		textEditorArea = null;
    		editor.destroy();
    		editor = null;
    	}
    	
    	if (textEditorCloseButton) {
    		bcmslib.jQuery(textEditorCloseButton).hide();
    	}
    	
    	if (textEditorOpenButton) {
    		bcmslib.jQuery(textEditorOpenButton).show();
    	}
    }
    
    // preview html text areas
    bcmslib.jQuery.htmlClean.defaults.removeTags = ["<script>"];
    
    function previewTextArea(previewButton) {
    	// Find out the div that contains the editor
    	var editorDivParent = bcmslib.jQuery(previewButton).siblings(".editableParent");
    	var currentTextEditorArea = editorDivParent.children('.editable').get(0);

    	if ( currentTextEditorArea != null) {
    		var text = bcmslib.jQuery(currentTextEditorArea).val();
    		if (!text) {
    			text = 'The field is empty'; 
    		}
    		else {
    			text = bcmslib.jQuery.htmlClean(text);
    		}
    		bcmslib.jQuery.colorbox({'opacity': 0.95, 'html': '<div style="width: 100%; height: 100%; font-size: 13px;">' + text + "</div>", 'width': '90%', 'height': '90%'});
    		// bcmslib.jQuery.fancybox({'content': text, 'autoDimensions': false, 'width': 600, 'height': 500});
    	}
    }
    
    // preview plain text areas
    function previewPlainTextArea(previewButton) {
    	// Find out the div that contains the editor
    	var textAreaToPreview = bcmslib.jQuery(previewButton).siblings(".plainText");

    	if ( textAreaToPreview != null) {
    		var text = bcmslib.jQuery(textAreaToPreview).val();
    		if (!text) {
    			text = 'The field is empty'; 
    		}
    		bcmslib.jQuery.colorbox({'opacity': 0.95, 'html': '<textarea style="width: 100%; height: 100%; font-size: 13px;">' + text + "</textarea>", 'width': '90%', 'height': '90%'});
    	}
    }
    
    
    /* ASTROBOA REST API REQUESTS
     * Implemented using amplify library
     */
    
    // getObjectCollection
    amplify.request.define( "objects", "ajax", {
    	url: "/console/contentObject",
        dataType: "json",
        type: "GET"
    });
    
    function getObjectCollection(query, projectionPaths, offset, limit, orderBy, successEvent, errorEvent, eventContext) {
    	query = encodeURIComponent(query);
		
    	if (offset == null || offset < 0) {
			offset = 0;
		}
    	
    	if (limit == null || limit < 0) {
    		limit = 50;
		}
    	
    	if (orderBy != null && orderBy != "") {
			orderBy = encodeURIComponent(orderBy);
		}
		
		if (projectionPaths != null && projectionPaths != "") {
			projectionPaths = encodeURIComponent(projectionPaths);
		}
		
		var data = {
			'cmsQuery': 		query,
			'projectionPaths':	projectionPaths,
			'offset':			offset,
			'limit':			limit,
			'orderBy':			orderBy
		}
		
		var requestSettings = {
		        'resourceId': 		'objects',
		        'data': 			data,
		        'success': 			function(data) {
		        						if (successEvent != null) {
		        							amplify.publish(successEvent, requestSettings, data, status, eventContext);
		        						}
		        						else {
		        							amplify.publish('astroboa.api.success', requestSettings, data, status, eventContext);
		        						}
		        					},
		        'error': 			function(data, status) {
		        						if (errorEvent != null) {
		        							amplify.publish(errorEvent, requestSettings, data, status, eventContext);
		        						}
		        						else {
		        							amplify.publish('astroboa.api.error', requestSettings, data, status, eventContext);
		        						}
		        					}
		    };
		
	    amplify.request(requestSettings);
    }
    
    // getObjectModel
    amplify.request.define( "models", "ajax", {
    	url: "/console/model/{fullPropertyPath}",
        dataType: "json",
        type: "GET",
        cache: true
    });
    
    function getObjectModel(fullPropertyPath, successEvent, errorEvent, eventContext) {
    	var data = {
    		'fullPropertyPath': fullPropertyPath,
    		'output':			'json'
    	}
    	
    	var requestSettings = {
    	        'resourceId': 		'models',
    	        'data': 			data,
    	        'success': 			function(data) {
    	        						if (successEvent != null) {
    	        							amplify.publish(successEvent, requestSettings, data, status, eventContext);
    	        						}
    	        						else {
    	        							amplify.publish('astroboa.api.success', requestSettings, data, status, eventContext);
    	        						}
    	        					},
    	        'error': 			function(data, status) {
    	        						if (errorEvent != null) {
    	        							amplify.publish(errorEvent, requestSettings, data, status, eventContext);
    	        						}
    	        						else {
    	        							amplify.publish('astroboa.api.error', requestSettings, data, status, eventContext);
    	        						}
    	        					}
    	    };
    	
    	amplify.request(requestSettings);
    }
    
    // if no error event is specified in astroboa api calls
    // then this default error subscriber will fire
    amplify.subscribe('astroboa.api.error', function( settings, data, status, eventContext ) {
       alert("An error occured in server communication. Please try again");
    });
    
    // if no success event is specified in astroboa api calls
    // then this default error subscriber will fire
    amplify.subscribe('astroboa.api.success', function( settings, data, status, eventContext ) {
       alert("Api call returned successfully. The returned data is:" + data);
    });
    
    
    
    (function($, amplify) {

    	$(function() {
    		$("form#objectSelectionForm").submit(function(event) {
    			// we should first get the property model to find which object types are
    			// allowed as values so that we can properly set the object search criteria
    			var fullPropertyPath = $("#objectSelectionDialogFullPropertyPath").val();
    			
    			getObjectModel(fullPropertyPath, 'objectSelectionDialog.getPropertyModel.success');
    			event.preventDefault();
    		});
    		
    		amplify.subscribe('objectSelectionDialog.getPropertyModel.success', function( settings, data, status, eventContext ) {
    			if (data != null) {
    				var  query = '';
    				var acceptedObjectTypes = data.acceptedContentTypes;
    				if (acceptedObjectTypes != null) {
    					query += '('
    					acceptedObjectTypeList = acceptedObjectTypes.split(',');
    					
    					for(i = 0; i < acceptedObjectTypeList.length - 1; i++){
    						query += 'objectType = "' + $.trim(acceptedObjectTypeList[i]) + '" OR '; 
    					}
	    				
    					query += 'objectType = "' + $.trim(acceptedObjectTypeList[acceptedObjectTypeList.length - 1]) + '") AND ';
    				}
    			
    				var title = $('#objectTitle').val();
        			query += 'profile.title CONTAINS "' + title + '*"';
        			getObjectCollection(
        				query, 'profile.title', 0, 300, 'profile.title asc', 'objectSelectionDialog.search.success');
    			}
    		});
    			
    		
    		amplify.subscribe('objectSelectionDialog.search.success', function( settings, data, status, eventContext ) {
    	    	if (data != null && data.totalResourceCount > 0) {
    	    		$("#objectSelectionDialogResults").html("");
    				objects = data.resourceCollection.resource;
    				$('<ul class="nostyle">').appendTo("#objectSelectionDialogResults");
    				$.each(objects, function(i, object) { 
    					var objectRowId = 'objectSelectionDialog' + object.cmsIdentifier;
    					var objectRow = '<li id="' + objectRowId +'"><a href="#" onclick="editServiceAsync.addObjectToPropertyValues(\'' 
    						+ object.systemName 
    						+ '\', true, showSelectedObject)">' 
    						+ object.profile.title + "</a></li>";
    					
    					$(objectRow).appendTo("#objectSelectionDialogResults");
    					// fetch the object type i18n label
    					getObjectModel(object.contentObjectTypeName, 'objectSelectionDialog.getTypeModel.success', null, objectRowId);
    				});
    				$('</ul>').appendTo("#objectSelectionDialogResults");
    	    	}
    	    	else {
    	    		$("#objectSelectionDialogResults").html("");
    	    		$("#objectSelectionDialogMessages").html('No Objects found').fadeIn(300).delay(4000).fadeOut();
    	    	}
    	    });
    		
    		amplify.subscribe('objectSelectionDialog.getTypeModel.success', function( settings, data, status, eventContext ) {
    			if (data != null) {
    				$('#'+eventContext).append(' (' + data.label[locale] + ')');
    			}
    		});
    		
    	});

    }(bcmslib.jQuery, amplify) );
    
    function showSelectedObject(result) {
    	resultObject = bcmslib.jQuery.parseJSON(result);
    	if (resultObject.status === 'success') {
    		reRenderProperty();
    	}
    	
    	bcmslib.jQuery("#objectSelectionDialogMessages").html(resultObject.message).fadeIn(300).delay(4000).fadeOut();
    }
		
    
    function addOnChangeEventToWorkflowProperty() {
    	bcmslib.jQuery('select[class*="managedThroughWorkflow"]').bind("change", function() 
    			{
    				reRenderWorkflowActions();
    			} 
    	);
    }
    
    /*HTTP SESSION CHECKER */
    var timeoutMillis = 180*60*1000+3000;
    var sessionTimeoutInterval = null;

    function startSessionTimeoutCheck() {
        sessionTimeoutInterval = setInterval('sessionChecker.isNewSession(alertTimeout)', timeoutMillis);
    }

    function stopSessionTimeoutCheck() {
        if (sessionTimeoutInterval) {
        	clearInterval(sessionTimeoutInterval);
        }
    }

    function resetSessionTimeoutCheck() {
        stopSessionTimeoutCheck();
        startSessionTimeoutCheck();
    }

    function alertTimeout(newSession) {
 		if (newSession) {
			clearInterval(sessionTimeoutInterval);
			showExpirationMessageWithRichModalPanel();
       }
    }
    
	function showExpirationMessageWithRichModalPanel(){
		Richfaces.showModalPanel('expirationMessagePanel');
	}
	
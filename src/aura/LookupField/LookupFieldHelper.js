({
    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Show a message
     **/
    showMessage : function(title, message, type, mode, duration) {
        var showToast = $A.get('e.force:showToast');
        showToast.setParams({
            'title': title,
            'message': message,
            'type': type,
            'mode': mode,
            'duration' : duration
        });
        // Fire the event
        showToast.fire();
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Show a quick info message
     **/
    showQuickMessage : function(type, title, message) {
        this.showMessage(title, message, type, 'dismissible', 2500);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Show the spinner
     **/
    showSpinner : function(component) {
        var loadingSpinner = component.find('loadingSpinner');
        $A.util.removeClass(loadingSpinner instanceof Array ? loadingSpinner[0] : loadingSpinner, 'slds-hide');
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Hide the spinner
     **/
    hideSpinner : function(component) {
        var loadingSpinner = component.find('loadingSpinner');
        $A.util.addClass(loadingSpinner instanceof Array ? loadingSpinner[0] : loadingSpinner, 'slds-hide');
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Create HTML
     **/
    createHTML : function(component, body, tag, HTMLAttributes, bindComponent) {
        $A.createComponent(
            'aura:html',
            {
                'tag':            tag,
                'body':           body,
                'HTMLAttributes': HTMLAttributes
            },
            function(newComponent, status, errorMessage) {
                // Add the Aura Component to the binding component
                if (status === 'SUCCESS') {
                    bindComponent.push(newComponent);
                }
                else if (status === 'INCOMPLETE') {
                    component.set('v.theError', 'Error: No response from server or client is offline.');
                }
                else if (status === 'ERROR') {
                    component.set('v.theError', 'Error: ' + errorMessage);
                }
            }
        );
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Create a lightning input
     **/
    createLabel : function(component, fieldName, field, bindComponent) {
        var labelElem = [];
        var labelBody = [];
        // If required
        if (field.required) {
            // Created the required indicator
            this.createHTML(component, '*', 'abbr', {'class':'slds-required','title':field.label+' is a required field'}, labelBody);
        }
        // Add the label text
        this.createHTML(component, field.label, 'span', {'class':'label-span'}, labelBody);
        // Create the label
        this.createHTML(component, labelBody, 'label', {'class':'slds-form-element__label','name':fieldName}, labelElem);
        // Create a container for the label
        this.createHTML(component, labelElem, 'div', {'class':'slds-p-bottom--small'}, bindComponent);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Get the sObject Label
     **/
    getSObjectLabel : function(component, helper) {
        // Show the spinner
        this.showSpinner(component);
        // Get the sObjectName
        var sObjectName = component.get('v.sObjectName');
        // Setup the server call to get the sobject label
        var getSObjectTypeLabelAction = component.get('c.getSObjectTypeLabel');
        // Store server response if possible
        getSObjectTypeLabelAction.setStorable();
        // Add the Params
        getSObjectTypeLabelAction.setParams({sObjectName : sObjectName});
        // Create a callback that is executed after the server-side action returns
        getSObjectTypeLabelAction.setCallback(this, function(response) {
            // Check the state
            var state = response.getState();
            // If it is successful
            if (component.isValid() && state === 'SUCCESS') {
                // Get the labels
                var sObjectLabels = response.getReturnValue();
                // If there is no error
                if (!('error' in sObjectLabels)) {
                    // Store the labels
                    component.set('v.sObjectTypeLabel', sObjectLabels.Label);
                    component.set('v.sObjectTypeLabelPlural', sObjectLabels.LabelPlural);
                    // Find the record
                    var forceRecord = component.find('forceRecord');
                    // Reload the record (this will load the lookup)
                    forceRecord.reloadRecord();
                } else {
                    // Set the error
                    component.set('v.theError', sObjectLabels.error);
                }
            } else if (component.isValid() && state === 'ERROR') {
                // Get the errors
                var theError = '';
                var errors = response.getError();
                if (errors) {
                    for (var i = 0; i < errors.length; i++) {
                        if (errors[i] && errors[i].message) {
                            theError += (theError == '' ? '' : ' ') + 'Error message: ' + errors[i].message;
                        }
                    }
                } else {
                    theError = 'Unknown error';
                }
                component.set('v.theError', theError);
            }
            // Hide the spinner
            helper.hideSpinner(component);
        });
        // Add the server action call to the queue
        $A.enqueueAction(getSObjectTypeLabelAction);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Load the Lookup
     **/
    loadLookup : function(component) {
        // Show the spinner
        this.showSpinner(component);
        // Get the name
        var name = component.get('v.name');
        // Get the record
        var theRecord = component.get('v.theRecord');
        // Get the value of the field
        component.set('v.value', component.get('v.theRecord.'+name));
        // Get the selected id
        var value = component.get('v.value');
        // If we have a selected id
        if (value && value != '') {
            // Find the selected record
            var selectedRecord = component.find('selectedRecord');
            // Reload the selected record
            selectedRecord.reloadRecord();
        }
        // Hide the spinner
        this.hideSpinner(component);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Search the records with the search term
     **/
    searchSObjectRecords : function(component, helper) {
        // Indicate that the search will start
        component.set('v.searchComplete', false);
        // Get the sObjectName
        var sObjectName = component.get('v.sObjectName');
        // Get the searchTerm
        var searchTerm = component.get('v.searchTerm');
        // If the search term is too short
        if (searchTerm.length < 2) {
            // Hide the list
            component.set('v.expanded', false);
            return;
        } else {
            // Expand the list
            component.set('v.expanded', true);
        }
        // Clear the records
        component.set('v.results', []);
        // Setup the server call to get the records
        var searchRecordsAction = component.get('c.searchSObjectRecords');
        // Store server response if possible
        searchRecordsAction.setStorable();
        // Add the Params
        searchRecordsAction.setParams({sObjectName : sObjectName, searchTerm : searchTerm});
        // Create a callback that is executed after the server-side action returns
        searchRecordsAction.setCallback(this, function(response) {
            // Check the state
            var state = response.getState();
            // If it is successful
            if (component.isValid() && state === 'SUCCESS') {
                // Get the results
                var recordSearchResult = response.getReturnValue();
                // If there is no error
                if (!('error' in recordSearchResult)) {
                    // Get the searchTerm
                    searchTerm = component.get('v.searchTerm');
                    // If the search term is too short (user might have edited again)
                    if (searchTerm.length < 2) {
                        // Hide the list
                        component.set('v.expanded', false);
                    } else {
                        // Store the records
                        component.set('v.results', recordSearchResult.records);
                        // Make sure the list is expanded
                        component.set('v.expanded', true);
                    }
                    // Indicate that the search is complete
                    component.set('v.searchComplete', true);
                } else {
                    // Set the error
                    component.set('v.theError', recordSearchResult.error);
                }
            } else if (component.isValid() && state === 'ERROR') {
                // Get the errors
                var theError = '';
                var errors = response.getError();
                if (errors) {
                    for (var i = 0; i < errors.length; i++) {
                        if (errors[i] && errors[i].message) {
                            theError += (theError == '' ? '' : ' ') + 'Error message: ' + errors[i].message;
                        }
                    }
                } else {
                    theError = 'Unknown error';
                }
                component.set('v.theError', theError);
            }
        });
        // Add the server action call to the queue
        $A.enqueueAction(searchRecordsAction);
    }
})
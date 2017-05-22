({
    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Init the Component
     **/
    doInit : function(component, event, helper) {
        // Get attributes
        var name = component.get('v.name');
        var fieldNames = component.get('v.fieldNames');
        // Add the lookup field name to the list of field names
        fieldNames.push(name);
        // Update the field names
        component.set('v.fieldNames', fieldNames);
        // Get the sObject Labels
        helper.getSObjectLabel(component, helper);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Handle Record Update
     **/
    recordUpdated : function(component, event, helper) {
        helper.loadLookup(component);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Handle Record Update Selected Record
     **/
    selectedRecordUpdated : function(component, event, helper) {},

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Remove the record value
     **/
    removeValue : function(component, event, helper) {
        // Show the spinner
        helper.showSpinner(component);
        // Get the name
        var name = component.get('v.name');
        // Get the record
        var theRecord = component.get('v.theRecord');
        // Remove the value
        component.set('v.theRecord.'+name, null);
        component.set('v.value', null);
        // Clear the search term
        component.set('v.searchTerm', null);
        // Hide the spinner
        helper.hideSpinner(component);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Search for records
     **/
    searchRecords : function(component, event, helper) {
        // Search the records
        helper.searchSObjectRecords(component, helper);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Select Record from list
     **/
    selectLookupResult : function(component, event, helper) {
        // Get the Selected Record Id
        var value = event.srcElement.dataset.id;
        // If we have a Selected Id
        if (value) {
            // Hide the list
            component.set('v.expanded', false);
            // Clear the search term
            component.set('v.searchTerm', null);
            // Get the name
            var name = component.get('v.name');
            // Set the value of the field on the record
            component.set('v.theRecord.'+name, value);
            // Set the value of the component
            component.set('v.value', value);
            // Reload the Lookup
            helper.loadLookup(component);
        }
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Show or hide the popover
     **/
    toggleSelectedRecordPopover : function(component, event, helper) {
        // Get the popover
        var popover = component.find('selectedRecordPopover');
        // Toggle the class
        $A.util.toggleClass(popover, 'slds-hide');
    },

    /**
    * @author:      Tiaan Swart (tiaan@cloudinit.nz)
    * @date:        22 April 2017
    * @description: Go to the selected record page
    **/
    goToSelectedRecord : function(component, event, helper) {
        // Show the spinner
        helper.showSpinner(component);
        // Get the selected record Id
        var value = component.get('v.value');
        // If we have one
        if (value && value != '') {
            // Go there
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId" : value
            });
            navEvt.fire();
        }
    },
})
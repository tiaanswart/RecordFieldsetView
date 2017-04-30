({
    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Init the Component
     **/
    doInit : function(component, event, helper) {
        console.log(component.get('v.recordId'));
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
        component.set('v.theSelectedId', null);
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
        // Get the searchTerm
        var searchTerm = component.get('v.searchTerm');
        // If we have a search term
        if (searchTerm.length >= 2) {
            // Expand the list
            component.set('v.expanded', true);
            // Search the records
            helper.searchSObjectRecords(component, helper);
        } else {
            // Hide the list
            component.set('v.expanded', false);
        }
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Select Record from list
     **/
    selectLookupResult : function(component, event, helper) {
        // Get the Selected Record Id
        var theSelectedId = event.srcElement.dataset.id;
        // If we have a Selected Id
        if (theSelectedId) {
            // Hide the list
            component.set('v.expanded', false);
            // Clear the search term
            component.set('v.searchTerm', null);
            // Get the name
            var name = component.get('v.name');
            // Get the value of the field
            component.set('v.theRecord.'+name, theSelectedId);
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
        var theSelectedId = component.get('v.theSelectedId');
        // If we have one
        if (theSelectedId && theSelectedId != '') {
            // Go there
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId" : theSelectedId
            });
            navEvt.fire();
        }
    },
})
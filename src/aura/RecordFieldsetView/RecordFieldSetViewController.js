({
    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Init the Component
     **/
    doInit : function(component, event, helper) {
        // Get attributes
        var sObjectName = component.get('v.sObjectName');
        var fieldSetName = component.get('v.fieldSetName');
        // If this is the default text for fieldsetName
        if (fieldSetName == 'Enter field set name') {
            // Set the error
            component.set('v.theError', 'An error occurred! Please supply a valid fieldset name for the '+sObjectName+' object!');
            // Hide the spinner
            helper.hideSpinner(component);
            // Exit the function
            return;
        } else {
            // Get the SObject Label
            helper.getSObjectLabel(component, helper, sObjectName);
            // Get the Fieldset Fields
            helper.getFieldsetFields(component, helper, sObjectName, fieldSetName);
        }
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Handle Record Update
     **/
    recordUpdated : function(component, event, helper) {
        // Build the record view again
        helper.getRecordDetailView(component);
    },

    /**
    * @author:      Tiaan Swart (tiaan@cloudinit.nz)
    * @date:        21 April 2017
    * @description: Create a new record
    **/
    createNewRecord : function(component, event, helper) {
        // Get sObjectName
        var sObjectName = component.get('v.sObjectName');
        // Call the create record event
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": sObjectName
        });
        createRecordEvent.fire();
    },

    /**
    * @author:      Tiaan Swart (tiaan@cloudinit.nz)
    * @date:        21 April 2017
    * @description: Toggle Edit Mode
    **/
    toggleEditMode : function(component, event, helper) {
        // Show the spinner
        helper.showSpinner(component);
        // Toggle
        component.set('v.editMode', !component.get('v.editMode'));
        // Find the record
        var forceRecord = component.find('forceRecord');
        // Reload the record
        forceRecord.reloadRecord();
        // Build the record view again
        helper.getRecordDetailView(component);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Refresh the record
     **/
    refreshRecord : function(component, event, helper) {
        // Show the spinner
        helper.showSpinner(component);
        // Get the SObject Label
        var sObjectTypeLabel = component.get('v.sObjectTypeLabel');
        // Find the record
        var forceRecord = component.find('forceRecord');
        // Reload the record
        forceRecord.reloadRecord();
        // Toggle edit mode
        component.set('v.editMode', false);
        // Build the record view
        helper.getRecordDetailView(component);
        // Inform the user
        helper.showQuickMessage('info','Refreshed','The '+sObjectTypeLabel+' has been refreshed!');
    },

    /**
    * @author:      Tiaan Swart (tiaan@cloudinit.nz)
    * @date:        21 April 2017
    * @description: Save record changes
    **/
    saveRecord : function(component, event, helper) {
        // Show the spinner
        helper.showSpinner(component);
        // Get the SObject Label
        var sObjectTypeLabel = component.get('v.sObjectTypeLabel');
        // Find the record
        var forceRecord = component.find('forceRecord');
        // Save the record
        forceRecord.saveRecord();
        // Toggle edit mode
        component.set('v.editMode', false);
        // Build the record view
        helper.getRecordDetailView(component);
        // Inform the user
        helper.showQuickMessage('success','Saved','The '+sObjectTypeLabel+' has been saved!');
    }
})
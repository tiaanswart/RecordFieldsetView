({
    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Init the Component
     **/
    doInit : function(component, event, helper) {
        // Get the fieldSetName
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
            helper.getSObjectLabel(component, helper);
            // Get the Fieldset Fields
            helper.getFieldsetFields(component, helper);
        }
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Handle Record Update
     **/
    recordUpdated : function(component, event, helper) {
        // If the title should be the same as the name
        if (component.get('v.setNameAsTitle')) {
            // Set the name as the title
            helper.setNameAsTitle(component);
        }
        // Create the fields again
        helper.createFieldComponents(component);
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
        // Toggle Edit Mode
        component.set('v.editMode', !component.get('v.editMode'));
        // Find the record
        var forceRecord = component.find('forceRecord');
        // Reload the record
        forceRecord.reloadRecord();
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
        // Get the record
        var theRecord = component.get('v.theRecord');
        // Get the fieldsetFields
        var fieldsetFields = component.get('v.fieldsetFields');
        // Set the field validation check
        var validationSuccess = false;
        // If we have a record
        if (theRecord) {
            // For each field
            for (var fieldName in fieldsetFields) {
                // If key exists && the record has the field
                if (fieldsetFields.hasOwnProperty(fieldName) && fieldName in theRecord) {
                    // If the record is required && empty
                    if (fieldsetFields[fieldName].required && $A.util.isEmpty(theRecord[fieldName])) {
                        // Show an error
                        helper.showQuickMessage('error','Validation Error', fieldsetFields[fieldName].label+' is required!');
                        // Hide the spinner
                        helper.hideSpinner(component);
                        // Return
                        return;
                    }
                    // @TODO: Input Validation
                }
            }
        }
        // Find the record
        var forceRecord = component.find('forceRecord');
        // Save the record
        forceRecord.saveRecord();
        // Toggle edit mode
        component.set('v.editMode', false);
        // Inform the user
        helper.showQuickMessage('success','Saved','The '+sObjectTypeLabel+' has been saved!');
    }
})
({
    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
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
     * @date:        21 April 2017
     * @description: Show a quick info message
     **/
    showQuickMessage : function(type, title, message) {
        this.showMessage(title, message, type, 'dismissible', 2500);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Show the spinner
     **/
    showSpinner : function(component) {
        var loadingSpinner = component.find('loadingSpinner');
        $A.util.removeClass(loadingSpinner instanceof Array ? loadingSpinner[0] : loadingSpinner, 'slds-hide');
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Hide the spinner
     **/
    hideSpinner : function(component) {
        var loadingSpinner = component.find('loadingSpinner');
        $A.util.addClass(loadingSpinner instanceof Array ? loadingSpinner[0] : loadingSpinner, 'slds-hide');
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
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
     * @date:        21 April 2017
     * @description: Create a grid block
     **/
    createGrid : function(component, body, bindComponent) {
        this.createHTML(
            component,
            body,
            'div',
            {'class':'slds-grid slds-wrap slds-grid--pull-padded'},
            bindComponent
        );
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Create a column
     **/
    createColumn : function(component, body, bindComponent, columns) {
        // Set sizes
        var mediumSize = 6/columns;
        var largeSize = 12/columns;
        this.createHTML(
            component,
            body,
            'div',
            {'class':'slds-p-horizontal--small slds-size--1-of-1 slds-medium-size--'+mediumSize+'-of-6 slds-large-size--'+largeSize+'-of-12'},
            bindComponent
        );
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Create a select option component
     **/
    createSelectOption : function(component, option, bindComponent) {
        this.createHTML(component, [], 'option', {'value':option.value,'text':option.label}, bindComponent);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Create an input component per type
     **/
    createInputField : function(component, fieldName, field, bindComponent) {
        // Get the record
        var theRecord = component.get('v.theRecord');
        // Custom field types
        var customInputFieldTypeMap = {
            select          :   'ui:inputSelect',
            textarea        :   'lightning:textarea',
            date            :   'ui:inputDate',
            datetime        :   'ui:inputDateTime',
            richtext        :   'lightning:inputRichText',
            lookup          :   'c:LookupField'
        };
        // If this is a select
        if (field.type == 'select') {
            // For each option
            for (var i = 0; i < field.options.length; i++) {
                // If this should be selected
                if (field.options[i].value == theRecord[fieldName]) {
                    // Set selected
                    field.options[i].selected = 'true';
                }
            }
        }
        // If this is a lookup
        if (field.type == 'lookup') {
            // Add the required attributes
            field['recordId'] = component.get('v.recordId');
            field['editMode'] = true;
        }
        // Create the component
        $A.createComponent(
            field.type in customInputFieldTypeMap ? customInputFieldTypeMap[field.type] : 'lightning:input',
            field,
            function(newComponent, status, errorMessage) {
                // Add the Aura Component to the binding component
                if (status === 'SUCCESS') {
                    // Set the value reference
                    newComponent.set('v.value', component.getReference('v.theRecord.'+fieldName));
                    // Bind
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
     * @date:        21 April 2017
     * @description: Create an output component per type
     **/
    createOutputUI : function(component, fieldName, field, bindComponent) {
        // Map the different types of output
        var customOutputFieldTypeMap = {
            address         :   'ui:outputText',
            text            :   'ui:outputText',
            checkbox        :   'ui:outputCheckbox',
            date            :   'ui:outputDate',
            datetime        :   'ui:outputDateTime',
            email           :   'ui:outputEmail',
            select          :   'ui:outputText',
            tel             :   'ui:outputPhone',
            textarea        :   'ui:outputTextArea',
            time            :   'ui:outputText',
            currency        :   'ui:outputCurrency',
            richtext        :   'ui:outputRichText',
            lookup          :   'c:LookupField'
        };
        // If we have have a formatter & its currency
        if (field.formatter && field.formatter == 'currency') {
            // Set output as currency
            field.type = 'currency';
        }
        // If this is a lookup
        if (field.type == 'lookup') {
            // Add the required attributes
            field['recordId'] = component.get('v.recordId');
            field['editMode'] = false;
        }
        $A.createComponent(
            field.type in customOutputFieldTypeMap ? customOutputFieldTypeMap[field.type] : 'ui:outputText',
            field,
            function(newComponent, status, errorMessage) {
                // Add the Aura Component to the binding component
                if (status === 'SUCCESS') {
                    // Set the value reference
                    newComponent.set('v.value', component.getReference('v.theRecord.'+fieldName));
                    // Bind
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
     * @date:        21 April 2017
     * @description: Create an output component
     **/
    createOutputField : function(component, fieldName, field, bindComponent) {
        // Get the record
        var theRecord = component.get('v.theRecord');
        // If we have a value
        if (theRecord[fieldName]) {
            // If this is a url
            if (field.type == 'url') {
                // Create the URL
                var url = theRecord[fieldName];
                var httpString  = 'http://',
                    httpsString = 'https://';
                if (url.substr(0, 1) !== '/' &&
                    url.substr(0, httpString.length) !== httpString &&
                    url.substr(0, httpsString.length) !== httpsString) {
                    url = httpString + url;
                }
                // Create the anchor link
                this.createHTML(
                    component,
                    theRecord[fieldName],
                    'a',
                    {'href':url,'target':'_blank','class':'uiOutputURL slds-truncate','style':'display: inline-block;'},
                    bindComponent
                );
            } else {
                this.createOutputUI(component, fieldName, field, bindComponent);
                // If this is an address (for demo purposes manually show address for streets)
                if (field.type == 'address' || fieldName == 'BillingStreet' || fieldName == 'ShippingStreet') {
                    // Get the encoded address
                    var encodedAddress = encodeURI(theRecord[fieldName]);
                    // Create the URL
                    var url = 'https://www.google.com/maps/place/' + encodedAddress;
                    // Create the image url
                    var imgURL = 'https://maps.googleapis.com/maps/api/staticmap?center=' + encodedAddress + '&zoom=14&scale=false&size=250x125&maptype=roadmap&format=png&visual_refresh=true';
                    // Create the image
                    var theMapImage = [];
                    this.createHTML(
                        component,
                        '',
                        'img',
                        {'src':imgURL,'alt':theRecord[fieldName]},
                        theMapImage
                    );
                    // Create the anchor link
                    this.createHTML(
                        component,
                        theMapImage,
                        'a',
                        {'href':url,'target':'_blank','class':'slds-m-top--medium','style':'display:block;'},
                        bindComponent
                    );
                }
            }
        } else {
            this.createHTML(component, 'No value set', 'span', {'class':'slds-badge'}, bindComponent);
        }
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Create a label
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
     * @date:        21 April 2017
     * @description: Create a field output & label or input if not disabled
     **/
    createField : function(component, fieldName, field, bindContainer, columns, fieldIndex) {
        // Clear the container for the field
        var fieldContainer = [];
        // If we are in editMode and the field is editable
        if (component.get('v.editMode') && !field.disabled) {
            // If this is a richtext we need a label
            if (field.type == 'richtext') {
                // Create a label
                this.createLabel(component, fieldName, field, fieldContainer);
            }
            // Create the input
            this.createInputField(component, fieldName, field, fieldContainer);
        } else {
            // Create a label
            this.createLabel(component, fieldName, field, fieldContainer);
            // Create the output
            this.createOutputField(component, fieldName, field, fieldContainer);
        }
        // Create a wrapper for the field container
        var fieldWrapper = [];
        this.createHTML(component, fieldContainer, 'div', {'class':'slds-p-top--small slds-p-bottom--small'+(fieldIndex > columns ? ' slds-border--top' : '')}, fieldWrapper);
        // Create a new column and add the wrapper
        this.createColumn(component, fieldWrapper, bindContainer, columns);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        4 May 2017
     * @description: Create the field components
     **/
    createFieldComponents : function(component) {
        // Show the spinner
        this.showSpinner(component);
        // Init field container
        var recordDetailView = [];
        // Get the record
        var theRecord = component.get('v.theRecord');
        // Get the fieldsetFields
        var fieldsetFields = component.get('v.fieldsetFields');
        // If we have a record
        if (theRecord) {
            // Get the columns / size
            var columns = component.get('v.columns');
            // Keep track of the field index
            var fieldIndex = 0;
            // For each field
            for (var fieldName in fieldsetFields) {
                // If key exists and the record has the field
                if (fieldsetFields.hasOwnProperty(fieldName) && fieldName in theRecord) {
                    // Increment the field index
                    fieldIndex += 1;
                    // Create a new field
                    this.createField(
                        component,
                        fieldName,
                        fieldsetFields[fieldName],
                        recordDetailView,
                        columns,
                        fieldIndex
                    );
                }
            }
        }
        // Create grid container
        var recordDetailViewGrid = [];
        // Create a grid block for fields
        this.createGrid(component, recordDetailView, recordDetailViewGrid);
        // Set the field grid
        component.set('v.recordDetailView', recordDetailViewGrid);
        // Hide the spinner
        this.hideSpinner(component);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
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
                // Store the label
                component.set('v.sObjectTypeLabel', response.getReturnValue());
                // Get the labels
                var sObjectLabels = response.getReturnValue();
                // If there is no error
                if (!('error' in sObjectLabels)) {
                    // Store the labels
                    component.set('v.sObjectTypeLabel', sObjectLabels.Label);
                    component.set('v.sObjectTypeLabelPlural', sObjectLabels.LabelPlural);
                } else {
                    // Set the error
                    component.set('v.theError', 'Error Message: ' + sObjectLabels.error);
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
     * @date:        21 April 2017
     * @description: Set the name as the title
     **/
    setNameAsTitle : function(component) {
        // Get the record
        var theRecord = component.get('v.theRecord');
        // Set the new Title
        component.set('v.title', theRecord.Name);
    },

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Get all of the Fields from the fieldset
     **/
    getFieldsetFields : function(component, helper) {
        // Show the spinner
        this.showSpinner(component);
        // Get the sObjectName
        var sObjectName = component.get('v.sObjectName');
        // Get the fieldSetName
        var fieldSetName = component.get('v.fieldSetName');
        // Setup the server call to get the fieldset
        var getFieldsetAction = component.get('c.getFieldset');
        // Store server response if possible
        getFieldsetAction.setStorable();
        // Add the Params
        getFieldsetAction.setParams({sObjectName : sObjectName, fieldSetName : fieldSetName});
        // Create a callback that is executed after the server-side action returns
        getFieldsetAction.setCallback(this, function(response) {
            // Check the state
            var state = response.getState();
            // If it is successful
            if (component.isValid() && state === 'SUCCESS') {
                // Get the fieldset fields
                var fieldsetFields = response.getReturnValue();
                // If there is no error
                if (!('error' in fieldsetFields)) {
                    // Store the fieldset
                    component.set('v.fieldsetFields', fieldsetFields.fieldset);
                    // Get the field names from the fieldset
                    component.set('v.fieldNames', Object.keys(component.get('v.fieldsetFields')));
                    // Find the record
                    var forceRecord = component.find('forceRecord');
                    // Reload the record with the new fields (Will trigger reload and build component)
                    forceRecord.reloadRecord();
                } else {
                    // Set the error
                    component.set('v.theError', 'Error Message: ' + fieldsetFields.error);
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
        $A.enqueueAction(getFieldsetAction);
    }
})
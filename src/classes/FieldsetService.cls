/**
 * @author:      Tiaan Swart (tiaan@cloudinit.nz)
 * @date:        21 April 2017
 * @description: Service Class for FieldsetRecordView & LookupField Lightning Component
 **/
public with sharing class FieldsetService {

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Input Type Map
     **/
    private static Map<Schema.DisplayType, String> inputTypeMap = new Map<Schema.DisplayType, String>{
        Schema.DisplayType.ADDRESS => 'address',
        Schema.DisplayType.ANYTYPE => 'text',
        Schema.DisplayType.BOOLEAN => 'checkbox',
        Schema.DisplayType.CURRENCY => 'number',
        Schema.DisplayType.DATE => 'date',
        Schema.DisplayType.DATETIME => 'datetime',
        Schema.DisplayType.DOUBLE => 'number',
        Schema.DisplayType.EMAIL => 'email',
        Schema.DisplayType.ENCRYPTEDSTRING => 'text',
        Schema.DisplayType.ID => 'text',
        Schema.DisplayType.INTEGER => 'number',
        Schema.DisplayType.MULTIPICKLIST => 'select',
        Schema.DisplayType.PERCENT => 'number',
        Schema.DisplayType.PHONE => 'tel',
        Schema.DisplayType.PICKLIST => 'select',
        Schema.DisplayType.REFERENCE => 'lookup',
        Schema.DisplayType.STRING => 'text',
        Schema.DisplayType.TEXTAREA => 'textarea',
        Schema.DisplayType.TIME => 'time',
        Schema.DisplayType.URL => 'url'
    };

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Get the fieldset fields
     **/
    @AuraEnabled
    public static FieldsetResponse getFieldset(String sObjectName, String fieldSetName) {

        // Init the response wrapper
        FieldsetResponse response = new FieldsetResponse();

        try {

            // Init a return list
            response.fieldSet = new Map<String, Map<String, Object>>();

            // Get the sObject Decribe
            DescribeSObjectResult sObjectResult = Schema.getGlobalDescribe().get(sObjectName).getDescribe();

            // Get the sObject Fields
            Map<String, Schema.SObjectField> fieldMap = sObjectResult.fields.getMap();

            // Get the sObject FieldSets
            Map<String, Schema.FieldSet> fieldSetMap = sObjectResult.FieldSets.getMap();

            // If we have a valid fieldset
            if (fieldSetMap.containsKey(fieldSetName)) {

                // Get the field list
                List<Schema.FieldSetMember> fieldList = fieldSetMap.get(fieldSetName).getFields();

                // For each field in the list
                for (Schema.FieldSetMember f : fieldList) {

                    // Get the fieldname
                    String fieldName = f.getFieldPath();

                    // Set default editable
                    Boolean editable = False;

                    // Set field Describe variable
                    DescribeFieldResult fieldDescribe;

                    // If we have this field in this object
                    if (fieldMap.containsKey(fieldName)) {

                        // Get the field Describe
                        fieldDescribe = fieldMap.get(fieldName).getDescribe();

                        // Update the editable by the fields attribute
                        editable = fieldDescribe.isUpdateable();

                    }

                    // Type property
                    String type;

                    // If we dont support this field type
                    if (!inputTypeMap.containsKey(f.getType())) {

                        // Don't make it ediatble
                        editable = False;
                        // Default to Text
                        type = 'text';

                    } else {

                        // Else just get the type
                        type = inputTypeMap.get(f.getType());

                    }

                    // If the type is textarea and it is HTML formated
                    if (f.getType() == Schema.DisplayType.TEXTAREA && fieldDescribe.isHtmlFormatted()) {

                        // Set the type as richtext
                        type = 'richtext';

                    }

                    // Get all of the values needed
                    Map<String, Object> fieldSetMember = new Map<String, Object>{
                        'aura:id'   => 'field',
                        'name'      => f.getFieldPath(),
                        'label'     => f.getLabel(),
                        'type'      => type,
                        'required'  => f.getDbRequired() || f.getRequired(),
                        'disabled'  => !editable,
                        'recordId'  => '',
                        'editMode'  => False
                    };

                    // If this is a date or datetime && editable
                    if ((f.getType() == Schema.DisplayType.DATE || f.getType() == Schema.DisplayType.DATETIME) && editable) {
                        // Add the date picker
                        fieldSetMember.put('displayDatePicker', True);
                    }

                    // If this is a percent or currency && editable
                    if ((f.getType() == Schema.DisplayType.CURRENCY || f.getType() == Schema.DisplayType.PERCENT) && editable) {
                        // Add the step
                        fieldSetMember.put('step', '0.01');
                        // Add the formatter
                        fieldSetMember.put('formatter', f.getType() == Schema.DisplayType.CURRENCY ? 'currency' : 'percent');
                    }

                    // If this is a picklist && editable
                    if ((f.getType() == Schema.DisplayType.PICKLIST || f.getType() == Schema.DisplayType.MULTIPICKLIST) && editable) {
                        List<Map<String, Object>> options = new List<Map<String, Object>>();
                        // If this is a picklist
                        if (f.getType() == Schema.DisplayType.PICKLIST) {
                            options.add(
                                new Map<String, Object>{
                                    'value' => '',
                                    'label' => 'Select '+f.getLabel(),
                                    'selected' => True
                                }
                            );
                        }
                        // Get the options
                        for (Schema.PicklistEntry option : fieldDescribe.getPicklistValues()) {
                            options.add(
                                new Map<String, Object>{
                                    'value' => option.getValue(),
                                    'label' => option.getLabel(),
                                    'selected' => False
                                }
                            );
                        }
                        // Add the options
                        fieldSetMember.put('options', options);
                        // If this is a multi picklist
                        if (f.getType() == Schema.DisplayType.MULTIPICKLIST) {
                            // Set the attribute
                            fieldSetMember.put('multiple', True);
                        }
                    }

                    // If this is a reference field
                    if (f.getType() == Schema.DisplayType.REFERENCE) {
                        // SObject Name
                        String fieldSObjectName = '';
                        // For each Reference
                        for (Schema.sObjectType stype : fieldDescribe.getReferenceTo()) {
                            fieldSObjectName = stype.getDescribe().getName();
                        }
                        // Add the SObjectName
                        fieldSetMember.put('sObjectName', fieldSObjectName);
                    }

                    // Get the field path and map the values to the return list
                    response.fieldSet.put(fieldName, fieldSetMember);

                }

                // If we don't have the Name field
                if (response.fieldSet.containsKey('Name')) {

                    // Get field Describe
                    DescribeFieldResult fieldDescribe = fieldMap.get('Name').getDescribe();

                    // Add the Name field
                    response.fieldSet.put('Name', new Map<String, Object>{
                        'aura:id'   => 'field',
                        'name'      => 'Name',
                        'label'     => fieldDescribe.getLabel(),
                        'type'      => inputTypeMap.get(fieldDescribe.getType()),
                        'required'  => fieldDescribe.isNillable(),
                        'disabled'  => !fieldDescribe.isUpdateable(),
                        'recordId'  => '',
                        'editMode'  => False
                    });

                }

            } else {

                // Error with invalid fieldset name
                response.error = 'Invalid fieldset name for sObject! ['+sObjectName+']['+fieldSetName+']';

            }

        } catch (Exception e) {

            // Get the error
            response.error = e.getMessage() + ' ' + e.getStackTraceString();

        }

        // Return the response
        return response;

    }

    // Wrapper for Fieldset Response
    public class FieldsetResponse {
        @AuraEnabled
        public Map<String, Map<String, Object>> fieldset {get; set;}
        @AuraEnabled
        public String error {get; set;}
    }

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        21 April 2017
     * @description: Get the sobject type label
     **/
    @AuraEnabled
    public static SObjectTypeLabelResponse getSObjectTypeLabel(String sObjectName) {

        // Init the response wrapper
        SObjectTypeLabelResponse response = new SObjectTypeLabelResponse();

        try {

            // Init a return list
            Map<String, Map<String, Object>> fieldSet = new Map<String, Map<String, Object>>();

            // Get the sObject Decribe
            DescribeSObjectResult sObjectResult = Schema.getGlobalDescribe().get(sObjectName).getDescribe();

            // Get the label
            response.Label = sObjectResult.getLabel();
            response.LabelPlural = sObjectResult.getLabelPlural();

        } catch (Exception e) {

            // Get the error
            response.error = e.getMessage() + ' ' + e.getStackTraceString();

        }

        // Return the response
        return response;

    }

    // Wrapper for SObject Label Response
    public class SObjectTypeLabelResponse {
        @AuraEnabled
        public String Label {get; set;}
        @AuraEnabled
        public String LabelPlural {get; set;}
        @AuraEnabled
        public String error {get; set;}
    }

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Get the records for the search term
     **/
    @AuraEnabled
    public static SearchRecordResponse searchSObjectRecords(String sObjectName, String searchTerm) {

        // Init the response wrapper
        SearchRecordResponse response = new SearchRecordResponse();

        // Init the record list
        response.records = new List<SObject>();

        try {

            response.records = (List<SObject>)Database.query('SELECT Name FROM '+sObjectName+' WHERE Name LIKE \'%'+searchTerm+'%\'');

        } catch (Exception e) {

            // Get the error
            response.error = e.getMessage() + ' ' + e.getStackTraceString();

        }

        // Return the response
        return response;

    }

    // Wrapper for Search Record Response
    public class SearchRecordResponse {
        @AuraEnabled
        public List<SObject> records {get; set;}
        @AuraEnabled
        public String error {get; set;}
    }

}
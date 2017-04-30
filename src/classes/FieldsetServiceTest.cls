/**
 * @author:      Tiaan Swart (tiaan@cloudinit.nz)
 * @date:        22 April 2017
 * @description: Test class for FieldsetService
 **/
@isTest
public with sharing class FieldsetServiceTest {

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Setup test data
     **/
    @testSetup
    static void testSetup() {

        // Init list of Accounts
        List<Account> accounts = new List<Account>();

        // Add test Accounts
        accounts.add(new Account(Name = 'Test Account 1'));
        accounts.add(new Account(Name = 'Test Account 2'));

        // Insert Accounts
        Insert accounts;

    }

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Test the Get Fieldset method
     **/
    static testMethod void testGetFieldset() {

        // Get Fieldset with no params
        FieldsetService.FieldsetResponse response = FieldsetService.getFieldset(Null, Null);

        // Make sure we have an error
        System.assertNotEquals(Null, response.error);

        // Get Fieldset with incorrect name
        response = FieldsetService.getFieldset('Account', 'Incorrect_Fieldset_Name');

        // Make sure we have an error
        System.assertNotEquals(Null, response.error);

        // Get the Account Decribe
        DescribeSObjectResult accountDescribeResult = Account.SOBjectType.getDescribe();

        // Get the Accounts FieldSets
        Map<String, Schema.FieldSet> accountFieldsetMap = accountDescribeResult.FieldSets.getMap();

        // Get a Correct Fieldset Name
        String correctFielsetName;
        for (String fieldsetName : accountFieldsetMap.keySet()) {
            correctFielsetName = fieldsetName;
            break;
        }

        // Get the account fieldset field list
        List<Schema.FieldSetMember> accountFieldsetFieldList = accountFieldsetMap.get(correctFielsetName).getFields();

        // Get the correct fieldset fields size
        Integer correctFieldsetFieldsSize = accountFieldsetFieldList.size();

        // Check if we have a namefield
        Boolean hasNameField = False;
        for (Schema.FieldSetMember f : accountFieldsetFieldList) {
            hasNameField = f.getFieldPath() == 'Name' ? True : hasNameField;
        }

        // Get Fieldset with correct name
        response = FieldsetService.getFieldset('Account', correctFielsetName);

        // Make sure we have the correct number of fields
        System.assertEquals(correctFieldsetFieldsSize + (hasNameField ? 0 : 1), response.fieldset.size());

        // Make sure we have no error
        System.assertEquals(Null, response.error);

    }

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Test the get SObject Label method
     **/
    static testMethod void testGetSObjectTypeLabel() {

        // Get sObject Label with no params
        FieldsetService.SObjectTypeLabelResponse response = FieldsetService.getSObjectTypeLabel(Null);

        // Make sure we have an error
        System.assertNotEquals(Null, response.error);

        // Get the labels
        response = FieldsetService.getSObjectTypeLabel('Account');

        // Make sure we have the correct Label
        System.assertEquals(Account.SObjectType.getDescribe().getLabel(), response.Label);

        // Make sure we have no error
        System.assertEquals(Null, response.error);

    }

    /**
     * @author:      Tiaan Swart (tiaan@cloudinit.nz)
     * @date:        22 April 2017
     * @description: Test Search SObject Records method
     **/
    static testMethod void testSearchSObjectRecords() {

        // Search for records with no params
        FieldsetService.SearchRecordResponse response = FieldsetService.searchSObjectRecords(Null, Null);

        // Make sure we have an error
        System.assertNotEquals(Null, response.error);

        // Search for records
        response = FieldsetService.searchSObjectRecords('Account', 'Test Account');

        // Make sure we have 2 results
        System.assertEquals(2, response.records.size());

        // Make sure we have no error
        System.assertEquals(Null, response.error);

    }

}
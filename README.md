# RecordFieldsetView

A Fieldset Lightning Component for Salesforce Lightning Experience.

The component can be added to any Record Home Layout.

To contribute, please fork, update, push and create a pull request.

### Summer 17 - Lightning Data Service (Beta):

Please refer to the [release notes](https://releasenotes.docs.salesforce.com/en-us/summer17/release-notes/rn_lightning_data_service.htm).

`force:recordPreview` has been *deprecated* and *replaced* with `force:recordData`.

#### Known limitations:

1. `force:recordData` does not support User type Object (CreatedBy, Owner, LastModifiedBy, etc)

### Production / Sandbox (`force:recordData`):

<a href="https://githubsfdeploy.herokuapp.com?owner=tiaanswart&repo=RecordFieldsetView&ref=master">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

### Developer Edition (`force:recordPreview`):

<a href="https://githubsfdeploy.herokuapp.com?owner=tiaanswart&repo=RecordFieldsetView&ref=develop">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

### Functions available:

1. [Create new record](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/ref_force_createRecord.htm) (using standard record fields)
1. Edit the current record (using the fieldset field list)
1. Refresh the current record

### Supported Field Types (Schema.DisplayType):

1. ADDRESS
1. ANYTYPE
1. BOOLEAN
1. CURRENCY
1. DATE
1. DATETIME
1. DOUBLE
1. EMAIL
1. ENCRYPTEDSTRING
1. ID
1. INTEGER
1. MULTIPICKLIST
1. PERCENT
1. PHONE
1. PICKLIST
1. STRING
1. REFERENCE
1. TEXTAREA
1. TIME
1. URL

### Lightning Component Settings (Design attributes):

1. Show Icon - Show the header icon
1. Icon - The lightning icon as iconType:iconName
1. Icon Size - The size of the lightning icon. Possible values: small, medium, large.
1. Show Title - Show the header title
1. Title - The header title
1. Set Name As Title - Set the record name as the title
1. Show SObject Type - Show the SObject Type in the header
1. Fieldset - The fieldset for this record type
1. Columns - The number of columns for this record layout
1. Allow Create New - Allow creating a new record
1. Allow Edit - Allow Editing the record
1. Allow Refresh - Allow Refreshing the record
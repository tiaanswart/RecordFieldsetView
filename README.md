# RecordFieldsetView

<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

A Fieldset Lightning Component for Salesforce Lightning Experience.

The component can be added to any Record Home Layout.

### Functions available:

1. Create new record (using standard record fields)
1. Edit the current record (using the fieldset field list)
1. Refresh the current record

The component gets the fields from the fieldset and constructs output or input by field type.

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
1. TEXTAREA
1. TIME
1. URL

### Field Types Support coming soon (Schema.DisplayType):

1. REFERENCE

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
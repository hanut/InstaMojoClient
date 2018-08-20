# InstaMojoClient
Nodejs Library that exposes a simple interface for pulling data and reports from your instamojo account automatically.

This module intends to offer the following functionality - 
1. Automatically download invoices for a given year and month from the instamojo dashboard.
2. Automatically download payout report for given time frame from the instamojo dashboard.

## Why did I make this ?
The InstaMojo api does not allow fetching reports using rest endpoints. 
I needed just that because I'm too lazy to do the grunt work necessary
(login, click, click bleh!) so code to the rescue!

This is probably not the best or most efficient way to do it,
but it works and is good enough for my use case. You probably don't 
want to use this in any production code.

## How to use
Just initialise the module with your username and password then call
the download function from the invoices module.

~~~~~
// Example using environment variables to populate the username
// and password.

const USERNAME = process.env.INSTAMOJO_USERNAME;
const PASSWORD = process.env.INSTAMOJO_PASSWORD;

const IMClient = require('./index.js')(USERNAME, PASSWORD);

// Download invoice for June, 2018 
IMClient.Invoices.download(2018, 6).then(response => {
  // If everything went okay response will contain
  // an absolute path to the downloaded file.
  // Don't forget to fs.unlink() the file once you are done
  // or you risk stuffing up your disk with dozens of reports.
  console.log(response);
}).catch(console.log);
~~~~~

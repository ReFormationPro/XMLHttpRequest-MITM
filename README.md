# XMLHttpRequest-MITM
Allows you to modify XMLHttpRequests.

For now all you can do is modify the response by setting XMLHttpRequest.responseModify to a function that takes the original response and returns the modified response.

Later I will add send hook which will allow you to change URLs and parameters in POST case.

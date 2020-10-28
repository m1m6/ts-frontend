export const copyToClipboard = (wrapperId) => {
    // Create a "hidden" input
    var inputHelper = document.createElement('input');

    // Assign it the value of the specified element
    inputHelper.setAttribute('value', document.getElementById(wrapperId).innerText);

    // Append it to the body
    document.body.appendChild(inputHelper);

    // Highlight its content
    inputHelper.select();

    // Copy the highlighted text
    document.execCommand('copy');

    // Remove it from the body
    document.body.removeChild(inputHelper);
};

export const copyToClipboard = (wrapperId) => {
    var element = document.getElementById(wrapperId);

    // Change selected area
    var r = document.createRange();
    r.selectNode(element);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
    // Copy - requires clipboardWrite permission + crbug.com/395376 must be fixed
    document.execCommand('copy');
};

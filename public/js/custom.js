let links = document.getElementsByTagName('a')
let activePath = window.location.href
for (i=0; i<links.length; i++){
    let link = links[i]
    let linkPath = link.href
    if(activePath == linkPath){
        link.classList.add('active')
        console.log('Activated!')
    }
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

tinymce.init({
    selector: 'textarea',
    plugins: 'advlist autolink lists link charmap print preview hr anchor pagebreak',
    toolbar_mode: 'floating',
    height: 450,
});

const copyToClipboard = (url, copyElement) => {
    const hostname = window.location.hostname
    const port = window.location.port
    let stringToCopy = ''
    if(port == 0 || port == ''){
        stringToCopy = 'http://' + hostname + '/requests/fillup/' + url
    } else {
        stringToCopy = 'http://' + hostname + ':' + port + '/requests/fillup/' + url
    }
    let element = document.createElement('input')
    document.body.append(element)
    element.classList.add('hidden-link')
    element.readOnly = true
    element.value = stringToCopy
    element.select()
    document.execCommand('copy')
    element.parentNode.removeChild(element)
    $(copyElement).tooltip('hide')
        .attr('data-original-title', 'Copied!')
        .tooltip('show');

}
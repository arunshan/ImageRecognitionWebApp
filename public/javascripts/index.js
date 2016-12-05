(function () {
  document.getElementById('fileUpload').onchange = function () {
    document.getElementById('fileSelectionStatus').innerHTML = this.files.length + ' files selected'
    if (this.files.length > 0) {
      $('.uploadFileButton').css({
        display: 'block'
      })
    }
  };

  $('.performDetectButton').click((e) => {
    var imageData = JSON.stringify($('.performDetectButton').data('image'))
    $.post( "/detect", { image: imageData })
      .done(data => {
        if (data && data.results) {
          var images = data.results.images
          var imageHTML = ''
          images.map((image, i) => {
            imageHTML += `<div class="hamDistance">${(i + 1) + ') Similarity Measure: ' + image.hamDistance}</div>`
            imageHTML += `<div class="similarImage" style="background-image: url(${image.path})" />`
          })
          $('#similarImages').html(imageHTML)
        }
      })
  })
}());

let fileNum = 0;
let totalPage = 0;
let books = [];

// ======== Books format example ========= //
// books = [
//     book1 = { 
//         files : [ file1, file2],
//         size: a4,
//         thickness: 80g ...
//     }, 
//     book2 = {
//         files : [ file1, file2, file3 ] ...
//     }
// ] 

class Book {
    // files : [];
    // size;
    // thickness;
    // papertype;    
    // cover;
    // color;
    // binding;

    constructor() {
        this.files = [];
    }

    
    
}



// ======================== METHOD ======================= //
function loadPDF(file) {
    pdfjsLib.getDocument({ url: file.url }).then((pdf_doc) => {

        // $(".page-count").text(pdf_doc.numPages + "페이지");
        displayPDF(pdf_doc, file);

    }).catch((e) => {
        // [TODO] 메시지 관리하기.
        alert("파일을 로딩하는데 실패했습니다\n" + e.message);
    });
}

function displayPDF(pdf_doc, file) {
    fileNum++;

    $.get("../include/filecard.ejs", (data) => {
        let $card = $(data);
        $('.files-info').append($card);
        
        // Set file meta info
        $card.find('.pdfcard__meta--file-name').text(file.name.slice(0, -4));
        $card.find('.pdfcard__meta--page-count').text(pdf_doc.numPages); // '페이지'글자는 css에서 더해진다.
        
        
        pdf_doc.getPage(1).then((page) => {
            
            // Set canvas
            let canvas = $card.find('.pdfcard__canvas')[0];

            let scale_require = canvas.width / page.getViewport(1).width;

            let viewport = page.getViewport(scale_require);

            canvas.height = viewport.height;

            var renderContext = {
                canvasContext: canvas.getContext('2d'),
                viewport: viewport
            };

            page.render(renderContext).then(() => {

                // Do when page render complete.

            });

            // Set total page info.
            totalPage += pdf_doc.numPages;


        })

    });
}

// ============================================================= //

// create a first empty book.
books.push(new Book());




$(document).ready(() => {
    $("#input-file").on('change', (event) => {
        let selectedFiles = $("#input-file").get(0).files;

        for (var i = 0; i < selectedFiles.length; i++) {
            let file;

            if ('[application/pdf]'.indexOf(selectedFiles[i].type) == -1) {
                //[TODO] 메시지도 다 따로 한 파일에서 관리하기.
                alert("다음 파일은 PDF파일이 아닙니다.\n" + selectedFiles[i].name);
                return;
            }
            
            if (selectedFiles[i].name) {
                file = {
                    url: URL.createObjectURL(selectedFiles[i]),
                    name: selectedFiles[i].name
                }
            } else {
                // [TODO] 뭔가 조치를 해야될 것이다. UUID로 생성한다든가.
                file.name = '';
            }

            books[books.length - 1].files.push(file);
            
            
            loadPDF(file);

        }

        $(event.target).val(null);

        // books.push(fileinfo);
    });
});
let confirmed = false; 
let tongTinChi = 0;
let lstHocPhan = [];
class HocPhan {
    constructor(maHocPhan, tenHocPhan, giangVien, soTinChi, thoiGianHoc, sl_gh, trangThai) { 
        this.maHocPhan =  maHocPhan; // string
        this.tenHocPhan = tenHocPhan; // string
        this.giangVien = giangVien;  // string
        this.soTinChi = soTinChi; // number
        this.thoiGianHoc = thoiGianHoc; // string
        this.sl_gh = sl_gh; // array
        this.trangThai = trangThai; // string
    }
}

function isRegister(button){
    console.log('đã click vào button ' + button.textContent);
    let registered = (button.textContent == "Đăng ký") ? false : true;
    if (registered) { return }

    changeRegisterButton(button);

    // lấy thông tin của học phần từ hàng của button vừa click
    let row = button.closest('tr');
    let hocPhan = new HocPhan(
        row.cells[0].textContent,
        row.cells[1].textContent,
        row.cells[2].textContent,
        parseInt(row.cells[3].textContent),
        row.cells[4].textContent,
        row.cells[5].textContent.split('/').map(Number),
        row.cells[6].querySelector('button').textContent
    );
    lstHocPhan.push(hocPhan);
    // gọi phương thức để thêm môn học và tin chỉ của môn học vào danh sách đã đăng ký
    addToArray({ hocPhan, button });
}

function getIndexArray(lst, obj) {
    for (var i = 0; i < lst.length; i++) {
        if (String(lst[i].maHocPhan) === String(obj.maHocPhan)) {
            console.log(i);
            return i;
        }
    }
    return -1;
}

function addToArray(obj) {
    // tìm tới nơi lưu hiện thị của danh sách học phần đã đã đăng ký
    let ul = document.querySelector('#danh-sach-hoc-phan-da-dang-ky');

    let li = document.createElement('li');
    let li_tongTinChi = document.querySelector('#tong-tin-chi');

    // khi click vào button "đăng ký" thì biến tongTinChi sẽ tăng theo số tín chỉ của học phần được click
    tongTinChi += parseInt(obj.hocPhan.soTinChi);

    let button = document.createElement('button');
    button.textContent = 'Xoá';
    button.classList.add('btn', 'btn-danger', 'btn-sm');
    button.onclick = function() {
        let index = getIndexArray(lstHocPhan, obj.hocPhan);
        if (index != -1) {
            lstHocPhan.splice(index, 1);
            remove_hocphan_wait({ button, obj });
        } 
    }

    // thẻ li được thêm các class cần thiết
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    // thẻ li được thêm nội dung cần hiển thị
    li.textContent = obj.hocPhan.tenHocPhan + ' (' + obj.hocPhan.soTinChi + ' tín chỉ)';
    li.appendChild(button); // thẻ li thêm button "xoá" vào

    updateTongTinChiElment();  // cập nhật lại thông tin tín chỉ hiện thị
    
    ul.insertBefore(li, li_tongTinChi); // thêm học phần vào danh sách học phần chờ xác nhận
}

function updateTongTinChiElment() {
    let tongTinChiElement = document.querySelector('#tong-tin-chi strong');
    tongTinChiElement.textContent = tongTinChi;
}

function remove_hocphan_wait(obj) { 
    let li = obj.button.closest('li');
    if (li == null) {
        console.log('không tìm thấy thẻ li để xoá');
        return; 
    }

    changeRegisterButton(obj.obj.button);

    tongTinChi -= obj.obj.hocPhan.soTinChi;
    let tongTinChiElement = document.querySelector('#tong-tin-chi strong');
    tongTinChiElement.textContent = tongTinChi;
    li.remove(); 
}

function removeAllHocPhanWait() {
    let li_tongTinChi = document.querySelector('#danh-sach-hoc-phan-da-dang-ky #tong-tin-chi');
    let ul = document.querySelector('#danh-sach-hoc-phan-da-dang-ky')
    li_tongTinChi.querySelector('strong').textContent = '0';
    ul.innerHTML = '';
    ul.appendChild(li_tongTinChi);
    // ul.appendChild(li_tongTinChi);
    // console.log(li_tongTinChi.textContent);
}   


function changeRegisterButton(button) {
    if (button.textContent === 'Đăng ký') { 
        // khi đăng ký học phần thì button của học phần đấy chuyển thành màu đỏ
        button.classList.remove('btn', 'btn-success');
        button.classList.add('btn', 'btn-danger');

        // chuyển nội dung của button lại thành "Đã đăng ký"
        button.textContent = 'Đã đăng ký';
    }
    else if (button.textContent === 'Đã đăng ký') {
        // sau khi xoá học phần đã đăng ký thì chuyển màu của button lại thành màu xanh
        button.classList.remove('btn', 'btn-danger');
        button.classList.add('btn', 'btn-success');

        // chuyển nội dung của button lại thành "Đăng ký"
        button.textContent = 'Đăng ký';
    }
    
}

document.querySelector('#confirm-button').addEventListener('click', function() {
    let popup = document.querySelector('#popup');
    popup.style.display = 'flex'; // Hiển thị popup
    console.log('đã click xác nhận đăng ký');
});

document.querySelector('#confirm-popup').addEventListener('click', function() {
    confirmed = true;
    removeAllHocPhanWait();
    // removeAllState();
    displayConfirm();
    document.querySelector('#popup').style.display = 'none'; // Đóng popup
});

document.querySelector('#cancel-popup').addEventListener('click', function() {
    confirmed = false;
    document.querySelector('#popup').style.display = 'none'; // Đóng popup
});

function displayConfirm() {
    console.log('đã click xác nhận');
    let divPopup = Object.assign(
        document.createElement('div'),
        {
            id: 'popup-confirm-complete',
            className: 'popup-overlay'
        }
    );
    document.querySelector('#container-popup').insertBefore(divPopup, document.querySelector('#myModal'));
    divPopup.style.display = 'flex';

    let divConfirmlast = Object.assign(
        document.createElement('div'),
        {
            className: 'popup-content',
        }
    );
    divConfirmlast.appendChild(
        Object.assign(
            document.createElement('h2'),
            { 
                textContent: 'Đăng ký thành công' 
            }
        )
    );
    let okButton = Object.assign(
        document.createElement('button'),
        {
            textContent: 'OK',
            id: 'confirm-popup-ok',
            className: 'btn btn-success'
        }
    ); 

    divConfirmlast.appendChild(okButton);
    
    divPopup.appendChild(divConfirmlast);

    okButton.addEventListener('click', function() {
        document.querySelector('#registered-hoc-phan').style.display = 'table';
        fetchDataToTable();
        divPopup.style.display = 'none';
    });
}

function fetchDataToTable() {
    let table = document.querySelector('#table-list-course');
    let tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    for (var i = 0; i < lstHocPhan.length; i++) {
        let tr = document.createElement('tr');
        tr.appendChild(
            Object.assign(
                document.createElement('td'),
                { textContent: lstHocPhan[i].maHocPhan }
            )
        );
        tr.appendChild(
            Object.assign(
                document.createElement('td'),
                { textContent: lstHocPhan[i].tenHocPhan }
            
            )
        );
        tr.appendChild(
            Object.assign(
                document.createElement('td'),
                { textContent: lstHocPhan[i].giangVien }
            )
        );
        tr.appendChild(
            Object.assign(
                document.createElement('td'),
                { textContent: lstHocPhan[i].soTinChi }
            )
        );
        tr.appendChild(
            Object.assign(
                document.createElement('td'),
                { textContent: lstHocPhan[i].thoiGianHoc }
            )
        );
        tr.appendChild(
            Object.assign(
                document.createElement('td'),
                { textContent: lstHocPhan[i].sl_gh[0] + ' / ' + lstHocPhan[i].sl_gh[1] }
            )
        );
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}
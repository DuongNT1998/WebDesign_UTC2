$(document).ready(function() {
  const API_URL = "https://68f97a67ef8b2e621e7c2f1b.mockapi.io/Notes";

  // --- GET: Lấy danh sách ghi chú ---
  function loadNotes() {
    $.ajax({
      url: API_URL,
      type: "GET",
      success: function(data) {
        $("#noteList").empty();
        $("#noteList").append(`<tr>
          <th>ID</th>
          <th>Tên công việc</th>
          <th>Nội dung</th>
          <th>Ngày tạo</th>
          <th>Sửa trạng thái</th>
          <th>Xóa</th>
        </tr>`);
        data.forEach(note => {
          $("#noteList").append(`
            <tr data-id="${note.id}">
            <td><b>${note.id}</b></td>
              <td><b>${note.title}</b></td>
              <td>${note.content}</td>
              <td><b>${note.createdAt}</b></td>
              <td>
                <button class="toggleStatusBtn">${note.done ? "Chưa xong" : "Đã xong"}</button>
              </td>
              <td>
                <button class="deleteBtn">Xóa</button>
              </td>
            </tr>
          `);
        });
      },
      error: function() {
        alert("Lỗi khi tải dữ liệu!");
      }
    });
  }

  $("#loadNotes").click(loadNotes);

  // --- POST: Gửi ghi chú mới ---
  $("#addNote").click(function() {
    const newNote = {
      title: $("#title").val(),
      content: $("#content").val(),
      done: false,
      createdAt: new Date().toISOString()
    };

    $.ajax({
      url: API_URL,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(newNote),
      success: function(note) {
        alert("Đã thêm ghi chú mới!");
        loadNotes(); // load lại danh sách sau khi thêm
      },
      error: function() {
        alert("Không thể thêm ghi chú!");
      }
    });
  });

  // --- PUT: Sửa trạng thái DONE ---
  $("#noteList").on("click", ".toggleStatusBtn", function() {
    const tr = $(this).closest("tr");
    const noteId = tr.data("id");
    const currentText = $(this).text();
    const newStatus = currentText === "Đã xong" ? true : false;

    $.ajax({
      url: `${API_URL}/${noteId}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ done: newStatus }),
      success: function() {
        alert("Cập nhật trạng thái thành công!");
        loadNotes(); // tải lại bảng sau khi đổi trạng thái
      },
      error: function() {
        alert("Cập nhật thất bại!");
      }
    });
  });

  // --- DELETE: Xóa ghi chú ---
  $("#noteList").on("click", ".deleteBtn", function() {
    const tr = $(this).closest("tr");
    const noteId = tr.data("id");

    if (confirm("Bạn có chắc muốn xóa ghi chú này?")) {
      $.ajax({
        url: `${API_URL}/${noteId}`,
        type: "DELETE",
        success: function() {
          alert("Đã xóa ghi chú!");
          tr.remove(); // xóa dòng khỏi bảng
        },
        error: function() {
          alert("Xóa thất bại!");
        }
      });
    }
  });
});

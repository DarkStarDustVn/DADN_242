# SmartHome

# Cách chạy hệ thống

- Lần lượt thực hiện các bước trong file `README.md` ở folder backend
- Tiếp theo thực hiện các bước trong file `README.md` ở folder frontend

# Git commit:

<type>(<scope>): <message>

message: .... to ....

feat: thêm tính năng mới ----- feat(author): add file/folder to ....

fix: sửa lỗi trong mã nguồn -- fix(): fix ? to ?

docs: cập nhật tài liệu ------ docs: add instruction in README.md

style: thay đổi liên quan đến style

refactor: sửa đổi cấu trúc mã nguồn

perf: tăng hiệu suất

build: thay đổi, thêm, xoá thư viện, dependencies

chore: cập nhật không liên quan tới tính năng

revert: hoàn tác cái gì đó

# Git work flow:

- Clone github repo về máy bằng lệnh `git clone https://github.com/DarkStarDustVn/DADN_242.git`
- Tạo branch mới từ branch main, dùng lệnh `git branch <branch name>` (Ví dụ, nếu chọn task [FE] Header Component thì sử dụng lệnh `git branch fe_header_component`)
- Sau đó, nhảy qua branch vừa tạo bằng lệnh `git checkout <branch name>` (Như ví dụ trên, nhảy qua branch mới bằng lệnh `git checkout fe_header_component`)
- Tiến hành code trên branch này, sau khi đã test đủ tính năng thì `git add .`, `git commit -m <message>`, `git push`.
- Sau khi `push`, có thể lên repo trên github để tạo pull request nhằm merge branch này vào branch main.

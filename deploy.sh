# 拷贝项目
scp .env root@dev.ethevan.xyz:~/Projects/dishtime
scp ./* root@dev.ethevan.xyz:~/Projects/dishtime
# 启动
ssh -t root@dev.ethevan.xyz "pm2 restart dishtime"
SET PGPASSWORD=123456
pg_dump -h localhost -U postgres -d Hotel -F c -b -v -f hotel_backup.dump

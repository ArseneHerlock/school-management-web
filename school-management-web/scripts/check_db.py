import psycopg2

conn_str = 'postgresql://neondb_owner:npg_KEid0ysrac2l@ep-calm-rice-aoa7o3pq-pooler.c-2.ap-southeast-1.aws.neon.tech/kindergartenDB?sslmode=require'
conn = psycopg2.connect(conn_str)
cur = conn.cursor()

cur.execute('SELECT "PasswordHash" FROM "AspNetUsers" WHERE "UserName" = \'admin\'')
admin_hash = cur.fetchone()[0]

cur.execute('UPDATE "AspNetUsers" SET "PasswordHash" = %s WHERE "UserName" LIKE \'phuhuynh%%\'', (admin_hash,))
conn.commit()
print(f'Updated all {cur.rowcount} parent accounts password to Admin123!')

conn.close()

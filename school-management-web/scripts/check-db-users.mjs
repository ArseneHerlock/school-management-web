import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_KEid0ysrac2l@ep-calm-rice-aoa7o3pq-pooler.c-2.ap-southeast-1.aws.neon.tech/kindergartenDB?sslmode=require'
});

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT u."UserName", r."Name" as role 
    FROM "AspNetUsers" u 
    JOIN "AspNetUserRoles" ur ON u."Id" = ur."UserId" 
    JOIN "AspNetRoles" r ON ur."RoleId" = r."Id" 
    LIMIT 30
  `);
  console.log('Users sample:');
  console.table(res.rows);
  await client.end();
}

main().catch(console.error);

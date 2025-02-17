import {
  COLLECTIONS_NAME,
  connectionPool,
  DOCUMENTS_NAME,
  FOLDERS_NAME,
} from "@/lib/surrealdb";

export async function register() {
  await connectionPool.initialize();
  const db = await connectionPool.acquire();
  console.log("register");
  try {
    const migrationQueries = `
    DEFINE TABLE IF NOT EXISTS ${FOLDERS_NAME} SCHEMAFULL;
    DEFINE FIELD IF NOT EXISTS name ON TABLE ${FOLDERS_NAME} TYPE string;
    DEFINE FIELD IF NOT EXISTS createdAt ON TABLE ${FOLDERS_NAME} TYPE datetime DEFAULT time::now() READONLY;
    
    DEFINE TABLE IF NOT EXISTS ${DOCUMENTS_NAME} SCHEMAFULL;
    DEFINE FIELD IF NOT EXISTS name ON TABLE ${DOCUMENTS_NAME} TYPE string;
    DEFINE FIELD IF NOT EXISTS name_embedding ON TABLE ${DOCUMENTS_NAME} TYPE array<decimal> DEFAULT [];
    DEFINE FIELD IF NOT EXISTS content ON TABLE ${DOCUMENTS_NAME} TYPE string;
    DEFINE FIELD IF NOT EXISTS content_embedding ON TABLE ${DOCUMENTS_NAME} TYPE array<decimal> DEFAULT [];
    DEFINE FIELD IF NOT EXISTS createdAt ON TABLE ${DOCUMENTS_NAME} TYPE datetime DEFAULT time::now() READONLY;
    
    DEFINE TABLE IF NOT EXISTS ${COLLECTIONS_NAME} SCHEMAFULL;
    DEFINE FIELD IF NOT EXISTS name ON TABLE ${COLLECTIONS_NAME} TYPE string;
    DEFINE FIELD IF NOT EXISTS createdAt ON TABLE ${COLLECTIONS_NAME} TYPE datetime DEFAULT time::now() READONLY;
    
    DEFINE INDEX IF NOT EXISTS idx_documents_name_embedding ON ${DOCUMENTS_NAME} FIELDS name_embedding MTREE DIMENSION 768 DIST COSINE;
    DEFINE INDEX IF NOT EXISTS idx_documents_content_embedding ON ${DOCUMENTS_NAME} FIELDS content_embedding MTREE DIMENSION 768 DIST COSINE TYPE F32;
    `;
    await db.query(migrationQueries);
  } finally {
    connectionPool.release(db);
  }
}

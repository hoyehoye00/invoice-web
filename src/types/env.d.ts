declare namespace NodeJS {
  interface ProcessEnv {
    NOTION_API_KEY: string;
    NOTION_INVOICE_DB_ID: string;
    NOTION_ITEMS_DB_ID: string;
  }
}

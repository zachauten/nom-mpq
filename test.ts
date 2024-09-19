#! /usr/bin/env deno run -A test.ts

import init, { parse_wasm, get_files_wasm } from "./pkg/nom_mpq.js";

await init();

interface MPQ {
  archive_header: ArchiveHeader,
  user_data: UserData,
  hash_table_entries: HashTableEntry[],
  block_table_entries: BlockTableEntry[],
  encryption_table: any,
}

interface ArchiveHeader {
  header_size: number,
  archive_size: number,
  format_version: number,
  sector_size_shift: number,
  hash_table_offset: number,
  block_table_offset: number,
  hash_table_entries: number,
  block_table_entries: number,
  offset: number,
}

interface UserData {
  user_data_size: number,
  archive_header_offset: number,
  user_data_header_size: number,
  content: number[],
}

interface HashTableEntry {
  hash_a: number,
  hash_b: number,
  locale: number,
  platform: number,
  block_table_index: number,
}

interface BlockTableEntry {
  offset: number,
  archived_size: number,
  size: number,
  flags: number,
}

function main() {
  const blob = Deno.readFileSync("./clem_maru.SC2Replay");
  const parsed: any = parse_wasm(blob);
  // let u8 = Uint8Array.from(parsed.user_data.content);
  // let str = (new TextDecoder()).decode(u8);
  // console.log(str);
  const files = get_files_wasm(blob);

  console.log(parsed.read_mpq_file_sector("replay.details", true, blob));
}
main();

import useContract from "./useContract";

export default async function security() {
  await useContract("security", "Security", []);
}

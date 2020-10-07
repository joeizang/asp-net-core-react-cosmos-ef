import axios from "axios"

const baseUrl = "/UserApi"

export async function getUsername(): Promise<string> {
  try {
    const result = await axios.get<string>(baseUrl)
    return result.data
  } catch
    (err) {
    throw err
  }
}

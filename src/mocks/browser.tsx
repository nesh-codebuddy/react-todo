import { setupWorker } from "msw/browser"
import { todoCRUD } from "./todoCRUD"

export const worker = setupWorker(...todoCRUD)

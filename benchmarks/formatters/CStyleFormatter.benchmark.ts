import CStyleFormatter from "@/formatters/CStyleFormatter";
import { onlyFormatter } from "~test/helper";
import benchmark from "benny"

const formatterStyle = new CStyleFormatter()
const formatter = onlyFormatter(formatterStyle)

benchmark.suite(
	"CStyleFormatter",
	benchmark.add("CStyleFormatter#Numberformat1", () => {
		formatter.format("Number %d", 42)
	}),
	benchmark.add("CStyleFormatter#Numberformat2", () => {
		formatter.format("Number %d %d", 42, 69)
	}),
	benchmark.add("CStyleFormatter#Numberformat3", () => {
		formatter.format("Number %d %d %d", 42, 69, 420)
	}),
	benchmark.save({
		file: "CStyleFormatter",
		folder: "benchmarks/results",
		format: "chart.html",
		version: require("../../package.json").version,
		details: true,
	}),
	benchmark.save({
		file: "CStyleFormatter",
		folder: "benchmarks/results",
		format: "json",
		version: require("../../package.json").version,
		details: true,
	})
)


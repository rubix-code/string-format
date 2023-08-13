import PyStyleFormatter from "@/formatters/PyStyleFormatter";
import { onlyFormatter } from "~test/helper";
import benchmark from "benny"

const formatterStyle = new PyStyleFormatter()
const formatter = onlyFormatter(formatterStyle)

benchmark.suite(
	"PyStyleFormatter",
	benchmark.add("PyStyleFormatter#implicitIndexFormat1", () => {
		formatter.format("Number {}", 42)
	}),
	benchmark.add("PyStyleFormatter#implicitIndexFormat2", () => {
		formatter.format("Number {} {}", 42, 69)
	}),
	benchmark.add("PyStyleFormatter#implicitIndexFormat3", () => {
		formatter.format("Number {} {} {}", 42, 69, 420)
	}),
	benchmark.add("PyStyleFormatter#explicitIndexFormat1", () => {
		formatter.format("Number {0}", 42)
	}),
	benchmark.add("PyStyleFormatter#explicitIndexFormat2", () => {
		formatter.format("Number {0} {1}", 42, 69)
	}),
	benchmark.add("PyStyleFormatter#explicitIndexFormat3", () => {
		formatter.format("Number {0} {1} {2}", 42, 69, 420)
	}),
	benchmark.save({
		file: "PyStyleFormatter",
		folder: "benchmarks/results",
		format: "chart.html",
		version: require("../../package.json").version,
		details: true,
	}),
	benchmark.save({
		file: "PyStyleFormatter",
		folder: "benchmarks/results",
		format: "json",
		version: require("../../package.json").version,
		details: true,
	})
)

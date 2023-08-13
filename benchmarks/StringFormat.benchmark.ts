import "@/index"
import benchmark from "benny"

benchmark.suite(
	"GlobalFormatter",
	benchmark.add("CStyleFormatter#Numberformat1", () => {
		"Number %d".format(42)
	}),
	benchmark.add("CStyleFormatter#Numberformat2", () => {
		"Number %d %d".format(42, 69)
	}),
	benchmark.add("CStyleFormatter#Numberformat3", () => {
		"Number %d %d %d".format(42, 69, 420)
	}),
	benchmark.add("PyStyleFormatter#implicitIndexFormat1", () => {
		"Number {}".format(42)
	}),
	benchmark.add("PyStyleFormatter#implicitIndexFormat2", () => {
		"Number {} {}".format(42, 69)
	}),
	benchmark.add("PyStyleFormatter#implicitIndexFormat3", () => {
		"Number {} {} {}".format(42, 69, 420)
	}),
	benchmark.add("PyStyleFormatter#explicitIndexFormat1", () => {
		"Number {0}".format(42)
	}),
	benchmark.add("PyStyleFormatter#explicitIndexFormat2", () => {
		"Number {0} {1}".format(42, 69)
	}),
	benchmark.add("PyStyleFormatter#explicitIndexFormat3", () => {
		"Number {0} {1} {2}".format(42, 69, 420)
	}),
	benchmark.save({
		file: "GlobalFormatter",
		folder: "benchmarks/results",
		format: "chart.html",
		version: require("../package.json").version,
		details: true,
	}),
	benchmark.save({
		file: "GlobalFormatter",
		folder: "benchmarks/results",
		format: "json",
		version: require("../package.json").version,
		details: true,
	})
)

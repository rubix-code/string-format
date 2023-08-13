import benchmark from "benny"
import CStyleFormatter from "@/formatters/CStyleFormatter";
import PyStyleFormatter from "@/formatters/PyStyleFormatter";
import { StringFormat } from "@/StringFormat";

const cStyleFormatter = new CStyleFormatter();
const pyStyleFormatter = new PyStyleFormatter();

const formatter = new StringFormat();
formatter.addFormatter(cStyleFormatter);
formatter.addFormatter(pyStyleFormatter);

benchmark.suite(
	"C-Py Format Order",
	benchmark.add("CStyleFormatter#Numberformat1", () => {
		formatter.format("Number %d", 42)
	}),
	benchmark.add("CStyleFormatter#Numberformat2", () => {
		formatter.format("Number %d %d", 42, 69)
	}),
	benchmark.add("CStyleFormatter#Numberformat3", () => {
		formatter.format("Number %d %d %d", 42, 69, 420)
	}),
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
		file: "C-Py",
		folder: "benchmarks/results",
		format: "chart.html",
		version: require("../../package.json").version,
		details: true,
	}),
	benchmark.save({
		file: "C-Py",
		folder: "benchmarks/results",
		format: "json",
		version: require("../../package.json").version,
		details: true,
	})
)

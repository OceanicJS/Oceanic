import debug from "debug";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Debug(formatter: any, ...args: Array<any>) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	return debug("oceanic")(formatter, ...args);
}

import type { ContainerStatus, ResourceLimits } from "./container-simple";
import type { PackageManagerType, Shell } from "./platform";
import type { PortInfo } from "./port-simple";

export type ContainerState = {
	readonly id: string;
	readonly name: string;
	readonly status: ContainerStatus;
	readonly workdir: string;
	readonly shell: Shell;
	readonly packageManager: PackageManagerType;
	readonly env: Record<string, string>;
	readonly resourceLimits: Required<ResourceLimits>;
	readonly createdAt: number;
	readonly startedAt?: number;
	readonly stoppedAt?: number;
	readonly ports: ReadonlyArray<PortInfo>;
	readonly processIds: ReadonlyArray<number>;
};

export type MergedContainerConfig = {
	readonly name: string;
	readonly workdir: string;
	readonly shell: Shell;
	readonly packageManager: PackageManagerType;
	readonly autoDetectPackageManager: boolean;
	readonly env: Record<string, string>;
	readonly resourceLimits: Required<ResourceLimits>;
};

import subprocess

from setuptools import Command, setup  # type: ignore
from setuptools.command.build import build  # type: ignore


def system(command: str) -> type[Command]:
    class CustomCommand(Command):
        def initialize_options(self) -> None:
            pass

        def finalize_options(self) -> None:
            pass

        def run(self, *args, **kwargs) -> None:
            subprocess.check_call(command, shell=True)

    return CustomCommand


cmds = {"build_frontend": system("./setup.sh")}


class BuildCommand(build):
    # Makes the `cmds` commands sub-commands of the `build_command`, which has the
    # effect of the formers being invoked when the latter is invoked (which is invoked
    # in turn when the wheel must be built, through the `bdist_wheel` command)
    sub_commands = [(key, None) for key in cmds.keys()] + build.sub_commands


setup(
    cmdclass={
        "build": BuildCommand,
        **cmds,
    }
)

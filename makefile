# SHELL := /bin/bash
defaultPath = ~/Library/Application\ Support/com.bohemiancoding.sketch3/Plugins
# path variable
appStore = ~/Library/Containers/com.bohemiancoding.sketch3/Data/Library/Application\\ Support/com.bohemiancoding.sketch3/Plugins
bate = ~/Library/Application\\ Support/com.bohemiancoding.sketch3/Plugins
# get plugin path
pluginPath = $(shell if test -d $(defaultPath); then echo ${bate}; else echo ${appStore}; fi)


install: clean create copy

clean:
	rm -rf $(pluginPath)/Caliper/

create:
	mkdir $(pluginPath)/Caliper

copy:
	cp -rf sketch-caliper.sketchplugin $(pluginPath)/Caliper

.PHONY: install clean create copy
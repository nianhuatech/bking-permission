#!/bin/bash
# build 脚本, 生成tar.gz安装包, 用于发版
# ./build.sh as_dist 1.0.0 生成分发包, .tar.gz格式. 用于放入到open_paas中, 提供下载/安装包. 原始的开发框架
# ./build.sh as_saas 1.0.0 生成saas包, .zip格式, 用于默认安装saas

function usage() {
    echo "./build.sh as_dist 1.0.0 [/dest_dir/]"
    echo "./build.sh as_saas 1.0.0 [/dest_dir/]"
}


BASEDIR=$(dirname "$0")
cd "${BASEDIR}" || exit
CURRENT_DIR=$(pwd)
##################################
function info() {
    NOW=$(date +"%Y-%m-%d %H:%M:%S")
    echo "${NOW}"" [INFO] ""$1"
}

function error() {
    NOW=$(date +"%Y-%m-%d %H:%M:%S")
    echo "${NOW}"" [ERROR] ""$1"
}

function if_fail_then_exit() {
    if [ "$1" != "0" ]
    then
        error "$2"
        exit 1
    fi
}
function if_dir_not_exist_then_mkdir() {
    if [ ! -e "$1" ]
    then
        mkdir -p "$1"
        return $?
    fi
}

function if_file_exist_then_remove() {
    if [ -e "$1" ]
    then
        rm "$1"
        return $?
    fi
}

##################################
# args
echo "process args"

if [ "$1" != "as_dist" ] && [ "$1" != "as_saas" ]
then
    usage
    exit 1
fi

AS_SAAS=0
if [ "${1}" = "as_saas" ]
then
    AS_SAAS=1
fi


if [ -z "${2}" ]
then
    usage
    exit 1
fi
VERSION="${2}"


DEST_DIR="${3}"




##################################
# mkdir
echo "mkdir..."
DIST_DIR="${CURRENT_DIR}"/dist
if_dir_not_exist_then_mkdir "${DIST_DIR}"

FRAMEWORK_DIR="${DIST_DIR}/framework"

if [ -e "${FRAMEWORK_DIR}" ]
then
    rm -rf "${FRAMEWORK_DIR}"
fi
mkdir -p "${FRAMEWORK_DIR}"

##################################
# cp data
echo "copy data..."

FILES=$(ls "$CURRENT_DIR")
for FILE in ${FILES}
do
    # echo "${FILE}"
    if [ "${FILE}" != "dist" ]
    then
        cp -r "${FILE}" "${FRAMEWORK_DIR}"
    fi
done

rm "${FRAMEWORK_DIR}/build.sh"

if [ "${AS_SAAS}" -eq 1 ]
then
    mv "${FRAMEWORK_DIR}/conf/settings_production_saas.py" "${FRAMEWORK_DIR}/conf/settings_production.py"
    echo "keep app.yml"
    # PKG="${DIST_DIR}"/bk_framework_V"${VERSION}".zip
    PKG="${DIST_DIR}"/bk_framework.zip
    if_file_exist_then_remove "${PKG}"

    cd "${DIST_DIR}" || exit 1
    zip -r "${PKG}" framework >/dev/null 2>&1
    if_fail_then_exit "$?"  "make zip fail!"

    echo "make zip success!"
    rm -rf "${FRAMEWORK_DIR}"
    cd "${CURRENT_DIR}" || exit 1

else
    # remove saas files
    rm "${FRAMEWORK_DIR}/app.yml"
    rm "${FRAMEWORK_DIR}/conf/settings_production_saas.py"

    # make tar.gz
    echo "make tar.gz..."
    PKG="${DIST_DIR}"/framework_V"${VERSION}".tar.gz
    if_file_exist_then_remove "${PKG}"

    tar -czf "${PKG}" -C "${DIST_DIR}" framework
    if_fail_then_exit "$?" "make tar.gz fail!"
    echo "make tar.gz success!"
    rm -rf "${FRAMEWORK_DIR}"
fi

##################################
# copy to destination

if [ ! -z "${DEST_DIR}" ]
then
    echo "copy to dest dir: ${DEST_DIR}/"
    if_dir_not_exist_then_mkdir "${DEST_DIR}/"

    cp "${PKG}" "${DEST_DIR}/"
    echo "copy from ${PKG} to ${DEST_DIR}/"
fi
##################################
echo "DONE"

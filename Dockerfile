# Pull base image.
FROM us.gcr.io/is-now-illegal/opencv

MAINTAINER Ivan Seidel <ivanseidel@gmail.com>

# #
# # Note: ln -s /dev/null /dev/raw1394 is to prevent error on python's
# #		cv2 during import: "libdc1394 error: Failed to initialize libdc1394"
# #		So, if you want to run another command, just update your CMD to start
# #		with this script, followed by whatever you want. (Not cute, but works)
# #
COPY . /app/
CMD sh -c 'ln -s /dev/null /dev/raw1394'; cd app && npm start
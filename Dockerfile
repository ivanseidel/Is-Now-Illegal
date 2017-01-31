# Pull base image.
FROM node:6.9.4

MAINTAINER Ivan Seidel <ivanseidel@gmail.com>

# RUN apt-get update

#
# Python
#
# node base image already has python 2.7

#
# Essentials
#
RUN apt-get update
RUN apt-get install -y build-essential


#
# Install OpenCV Dependencies
#
RUN apt-get install -y cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
RUN apt-get install -y python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev

#
# Install OpenCV
#
RUN git clone https://github.com/opencv/opencv.git
RUN cd opencv && mkdir build && cd build
RUN cd opencv/build && cmake \
	-D CMAKE_BUILD_TYPE=RELEASE \
	-D CMAKE_INSTALL_PREFIX=/usr/local \
	-D INSTALL_C_EXAMPLES=OFF \
	-D INSTALL_PYTHON_EXAMPLES=OFF \
	-D BUILD_EXAMPLES=OFF \
	..
RUN cd opencv/build && make
RUN cd opencv/build && make install

COPY . /app/


# # 
# # Install dependencies required by node-canvas
# # 
# RUN apt-get install -y libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

# #
# # Clear cache
# #
# RUN apt-get autoclean && apt-get clean
# RUN rm -rf /var/lib/apt/lists/*

# #
# # Note: ln -s /dev/null /dev/raw1394 is to prevent error on python's
# #		cv2 during import: "libdc1394 error: Failed to initialize libdc1394"
# #		So, if you want to run another command, just update your CMD to start
# #		with this script, followed by whatever you want. (Not cute, but works)
# #
CMD sh -c 'ln -s /dev/null /dev/raw1394'; npm start
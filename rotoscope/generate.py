import os
import sys
import cv2
import json
import numpy as np

from rotoscope import rotoscope

# Reads the path from cmd
if len(sys.argv) != 2:
	print("Usage: python generate.py <image-folder>")
	exit()
folder = sys.argv[1]
jsonPath = os.path.join(folder, 'frames.json')

# Load frames
frames = json.load(open(jsonPath))

# Used to compute motion blur
lastCorners = None

# Create text image
# text = cv2.imread('text.png')
textSize = 100, 80, 3
text = np.zeros(textSize, dtype=np.uint8)
# text = cv2.imread('text.png')

# Iterate trough frames
for frame in frames:
	# Load image
	name = frame['file']
	filePath = os.path.join(folder, name)
	image = cv2.imread(filePath)

	# Do rotoscope
	rotoscope(image, text, frame)

	# Show final result
	cv2.imshow(name, image)
	


cv2.waitKey(0)
cv2.destroyAllWindows()
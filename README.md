# The Buzz.js Road map
I'm not going to describe Buzz.js again because the documentation for it not only exists inside the [README](https://github.com/buzz-js/buzz-js/blob/stable/README.md) but this is the SDK that lets all the magic actually happen.

-	In the first phase, the base SDK — meaning the fundamental components, services, and controllers that everything else would be built on top of — is made. Even the other, more specified, widgets in the framework like the PageViews that are supposed to be the topmost Widgets in the every Page in the WebApp — a System Navigable widget class.

- 	In the second phase, we would be writing the more specialized widget while running edge-case tests on the stuff we already have in order to fix any bugs and make any optimizations that would be necessary under the hood. Here, we would make widgets that handle responsiveness like the `ResponsivePageView`, and even some specific use cases like a `CalendarWidget`:smile:.

-	In the third phase, we would begin offering crowds and groups to test Buzz and share their feedback with us. Then, the contributors would split into two teams: the first one would work on porting Buzz to the Node.js ecosystem while the second one would work on performing bug fixes and optimizations that the communities and groups we offer to try buzz suggest.

# Phase 1 Goals :soccer::trophy:
Date Started:	May 11, 2023 <br>
Date Concluded:	July 25th, 2023 <br>
01. ~~Create the application abstraction~~
02. ~~Create the global context management system~~
03. ~~Create the base Widget class and define its characteristics~~
04. ~~Create the StatelessWidget class and define its characteristics~~
05. ~~Create the StatefulWidget class and define its characteristics~~
06. ~~Implement state management using an on-demand approach~~
07. ~~Implement a Renderer to allow users to render views inside a viewport anything they feel a need to~~
08. ~~Implement Global Application Themes~~
09. ~~Create helper functions that make the process of using the SDK more bearable~~
10. ~~Create an abstraction for a HTML viewport that only serves to know the current size of a Widget~~
11. ~~Create the base WidgetStyle class for styling widgets~~
12. ~~Create the classes that handle radial and linear space. InsetsGeometry and RadialGeometry~~
13. ~~Create the base class for Container-type Widgets~~
14. ~~Properly define the application Running System~~
15. ~~Create abstractions for borders and border radius~~
16. ~~Create helper functions to apply borders and border radius~~
17. ~~Implement Text Widgets~~
18. ~~Implement Text Overflows that include ellipsis~~
19. ~~Implement the ImageView and SvgImageView widgets for displaying images.~~
20. ~~Implement the SizedBox widget for constraining the Size of its child~~
21. ~~Implement the ScrollableContainer widget to allow us to make scrollable screens.~~
22. ~~Implement TextInput Widget so that implementors have a Widget that can read user input~~
23. ~~Implement IconButton Widget~~
24. ~~Implement TextButton Widget~~
25. ~~Implement an abstraction that makes it easy to write CSS-dimensions in Buzz.js~~
26. ~~Implement ActionController widget to add input functionality to otherwise uneventful Widgets~~
27. ~~Implement the Router, NavigationController, and NavigationAnchor classes so we would be able to switch the context of the page~~
28. ~~Implement the ColoredBox so that it would be possible to create boxes that just have concept of color~~
29. ~~Implement the flexbox widgets Flex, Column, Row, Wrap, and Flexible.~~
30. ~~Implement the Free font awesome icons~~
31. ~~Implement the Icon widget.~~
32. ~~Implement Icon Animation~~
33. ~~Implement the PageView Widget~~

# Phase 2 Goals :soccer::trophy:
1. Implement the Drawer Widget
2. Implement the NavigationBar Widget
3. Implement the FooterWidget
4. Implement the ExpandableListWidget
5. Implement the VideoView widget for displaying videos (this would be rather difficult to do desirably).
6. Implement ProgressIndicator, CircularProgressIndicator, and LinearProgressIndicator widgets.
7. Implement ProgressButton Widget
8. Implement the `DashboardPageView` widget
9. Implement the `MobilePageView` widget
10. Implement the `ResponsivePageView` widget.
11. Implement pop-ups, dialogs, and modals to add an extra layer of reinforcement to the user experience.
12. Implement animations, transitions, and their controllers to make everything feel more lively.
13. Implement the CalendarView widget for taking date entries as input.
    

# Phase 3 Goals :soccer::trophy:

<aside class="left-sidebar">
    <!-- Sidebar scroll-->
    <div class="scroll-sidebar">

        <!-- Sidebar navigation-->
        <nav class="sidebar-nav my-5">

            <ul id="sidebarnav">
                <li class="<?= basename($_SERVER['REQUEST_URI']) == "dashboard.php" ? 'proactive' : ''?>">
                    <a href="dashboard.php" aria-expanded="false" >
                    <i class="ti-home"></i><span class="hide-menu">Dashboard</span></a>
                </li>
               
                <li class="<?= basename($_SERVER['REQUEST_URI']) == "userstudents.php" ? 'proactive' : ''?>">
                    <a href="userstudents.php" aria-expanded="false"> <i class="ti-book"></i><span class="hide-menu">Student</span></a>
                </li>
                <li>
                    <a href="index3.html"><i class="mdi mdi-phone"></i></i><span class="hide-menu">Contact Us</span></a>
                </li>
                <li>
                    <a href="test\home\dl\test.php">
                        <i class="ti-headphone-alt"></i><span class="hide-menu">Help Center</span></a>
                </li>
            </ul>

        </nav>
        <!-- End Sidebar navigation -->
    </div>
    <!-- End Sidebar scroll-->
</aside>
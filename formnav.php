<nav class="nav mt-3">
    <ul class="d-flex px-5">
        <li class="<?= basename($_SERVER['REQUEST_URI']) == "/newproject/create-student.php" ? 'bg-info' : '' ?>">
            <a href="create-student.php">Personaldetails</a>
        </li>
        <li class="<?= basename($_SERVER['REQUEST_URI']) == "education.php" ? 'bg-info' : '' ?>"><a href="education.php" >Education</a></li>
        <li><a href="travel.php">Travel&Immigration</a></li>
        <li><a href="reference.php">Referree</a></li>
        <li><a href="employment.php">WorkDetails</a></li>
        <li><a href="document.php">Docs</a></li>
      
        <li><a href="shortist.php">Shortlist</a></li>
        <li><a href="">Messages</a><i></i></li>
    </ul>

</nav>
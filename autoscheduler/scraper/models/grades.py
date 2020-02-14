""" Heavily based off of Good Bull Schedules """

from typing import Dict, Union
from django.db import models

class GradeManager(models.Manager):
    """ Connects to the Grades models so we can call
        Grades.object.instructor_performance
    """

    def instructor_performance(
            self, dept: str, course_num: str, instructor: str
    ) -> Dict[str, Union[int, float]]:
        """ Aggregates all of the GPA's / sum of each grade type into one object
            so we can quickly get how an instructor performed in past sections
            for a given course

            Returns a dictionary of string-integer/float pairs, where str is the attribute
            (i.e. gpa), and float is the according value (is an integer for grade counts)
        """

        return (
            # prefetch_related retrieves all of the related objects in a single query
            self.prefetch_related("section").filter(
                section__subject=dept,
                section__course_num=course_num,
                section__instructor=instructor,
            ).aggregate(
                gpa=models.Avg("gpa"), # Averages all of the GPA's together

                # We want a sum so we can more-easily calculate the percentage
                # Sums the count of each grade
                A=models.Sum("A"),
                B=models.Sum("B"),
                C=models.Sum("C"),
                D=models.Sum("D"),
                F=models.Sum("F"),
                I=models.Sum("I"),
                S=models.Sum("S"),
                U=models.Sum("U"),
                Q=models.Sum("Q"),
                X=models.Sum("X"),
            )
        )

class Grades(models.Model):
    """ Represents a collection of the grade distribution values for a
        specific section
    """

    # Section is the primary key, since one section = one grade distribution
    section = models.OneToOneField("Section", on_delete=models.CASCADE, primary_key=True)

    # Overrides the default Grades.objects member, which allows us
    # to call Grades.object.instructor_performance
    objects = GradeManager()

    gpa = models.FloatField()

    # Each of these represent how many students received the given grade
    # See http://student-rules.tamu.edu/rule10/ for more details
    A = models.IntegerField(db_index=True)
    B = models.IntegerField(db_index=True)
    C = models.IntegerField(db_index=True)
    D = models.IntegerField(db_index=True)
    F = models.IntegerField(db_index=True)

    I = models.IntegerField(db_index=True) # Incomplete
    S = models.IntegerField(db_index=True) # "Satisfactory"
    U = models.IntegerField(db_index=True) # "Unsatisfactory"
    Q = models.IntegerField(db_index=True) # Q drops
    X = models.IntegerField(db_index=True) # No grade submitted

    class Meta:
        db_table = "grades"

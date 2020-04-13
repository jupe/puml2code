/**
 * \file Vehicle.h
 */

#ifndef Vehicle_h
#define Vehicle_h




class Vehicle {
  private:
  protected:
  public:

  public:
    Vehicle()
    {
      // @todo
    }
    // Public methods

    /**
     *  @return String
     */
    String getType() {
      // @todo 
      return String();
    }


  // Protected methods
  protected:

  // Private methods
  private:
}

#endif // Vehicle_h

/**
 * \file Car.h
 */

#ifndef Car_h
#define Car_h

#include "Vehicle.h"


class Car: public Vehicle {
  private:
    String model;
    String make;
    Number year;
  protected:
  public:

  public:
    Car(): Vehicle()
    {
      // @todo
    }
    // Public methods

    /**
     *  @param model TBD
     */
    void setModel(String model='lada') {
      // @todo 
    }

    /**
     *  @param make TBD
     */
    void setMake(String make) {
      // @todo 
    }

    /**
     *  @param  TBD
     */
    void setYear(Number param0) {
      // @todo 
    }

    /**
     *  @return String
     */
    String getModel() {
      // @todo 
      return String();
    }

    /**
     *  @return String
     */
    String getMake() {
      // @todo 
      return String();
    }

    /**
     *  @return Number
     */
    Number getYear() {
      // @todo 
      return Number();
    }


  // Protected methods
  protected:

  // Private methods
  private:
}

#endif // Car_h

/**
 * \file NamesInThings.h
 */

#ifndef NamesInThings_h
#define NamesInThings_h




class NamesInThings {
  private:
    String _some_private;
    String_2 field_2;
  protected:
  public:
    String field;
    String1 field1;

  public:
    NamesInThings()
    {
      // @todo
    }
    // Public methods

    /**
     */
    void member() {
      // @todo 
    }


  // Protected methods
  protected:
    /**
     */
    void member3() {
      // @todo 
    }


  // Private methods
  private:
    /**
     *  @return String1
     */
    String1 member2() {
      // @todo 
      return String1();
    }

    /**
     *  @return String2
     */
    String2 member_s() {
      // @todo 
      return String2();
    }

}

#endif // NamesInThings_h

/**
 * \file Toyota.h
 */

#ifndef Toyota_h
#define Toyota_h

#include "Car.h"


class Toyota: public Car {
  private:
  protected:
  public:

  public:
    Toyota(): Car()
    {
      // @todo
    }
    // Public methods


  // Protected methods
  protected:

  // Private methods
  private:
}

#endif // Toyota_h

/**
 * \file Honda.h
 */

#ifndef Honda_h
#define Honda_h

#include "Car.h"


class Honda: public Car {
  private:
  protected:
  public:

  public:
    Honda(): Car()
    {
      // @todo
    }
    // Public methods


  // Protected methods
  protected:

  // Private methods
  private:
}

#endif // Honda_h

/**
 * \file Ford.h
 */

#ifndef Ford_h
#define Ford_h

#include "Car.h"


class Ford: public Car {
  private:
  protected:
  public:

  public:
    Ford(): Car()
    {
      // @todo
    }
    // Public methods


  // Protected methods
  protected:

  // Private methods
  private:
}

#endif // Ford_h

/**
 * \file Hyundai.h
 */

#ifndef Hyundai_h
#define Hyundai_h

#include "Car.h"


class Hyundai: public Car {
  private:
  protected:
  public:

  public:
    Hyundai(): Car()
    {
      // @todo
    }
    // Public methods


  // Protected methods
  protected:

  // Private methods
  private:
}

#endif // Hyundai_h


import Array "mo:core/Array";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

actor {
  public type LogEntry = {
    timestamp : Time.Time;
    message : Text;
  };

  module LogEntry {
    public func compareByTime(entry1 : LogEntry, entry2 : LogEntry) : Order.Order {
      Int.compare(entry2.timestamp, entry1.timestamp);
    };
  };

  var logList = List.empty<LogEntry>();

  public shared ({ caller }) func addLog(message : Text) : async () {
    if (message == "") { Runtime.trap("Message cannot be empty") };
    let entry : LogEntry = {
      timestamp = Time.now();
      message;
    };
    logList.add(entry);
  };

  public query ({ caller }) func getLogs() : async [LogEntry] {
    logList.toArray().sort(LogEntry.compareByTime);
  };

  public shared ({ caller }) func clearLogs() : async () {
    logList.clear();
  };
};
